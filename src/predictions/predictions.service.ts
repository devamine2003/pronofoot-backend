import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PointsCalculatorService } from './points-calculator.service';
import { CreatePredictionDto, PredictionResponseDto } from './predictions.dto';
import { MatchStatus, Prediction } from '../common/prisma-types';

@Injectable()
export class PredictionsService {
  private readonly logger = new Logger(PredictionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly calculator: PointsCalculatorService,
  ) {}

  async upsert(dto: CreatePredictionDto): Promise<Prediction> {
    const user = await this.usersService.findByUuid(dto.userUuid);
    const match = await (this.prisma as any).match.findUnique({ where: { id: dto.matchId } });

    if (!match) throw new NotFoundException(`Match ${dto.matchId} not found`);

    if (match.kickoff <= new Date()) {
      throw new BadRequestException('Predictions are locked after kickoff');
    }

    if (match.status === MatchStatus.FINISHED || match.status === MatchStatus.CANCELLED) {
      throw new BadRequestException(`Cannot predict a ${match.status} match`);
    }

    const prediction = await (this.prisma as any).prediction.upsert({
      where: { userId_matchId: { userId: user.id, matchId: dto.matchId } },
      create: {
        userId: user.id,
        matchId: dto.matchId,
        predictedHomeScore: dto.predictedHomeScore,
        predictedAwayScore: dto.predictedAwayScore,
      },
      update: {
        predictedHomeScore: dto.predictedHomeScore,
        predictedAwayScore: dto.predictedAwayScore,
        isCalculated: false,
        pointsEarned: 0,
        bonusPoints: 0,
      },
    });

    this.logger.log(`Prediction saved: user ${user.uuid} → match ${dto.matchId}`);
    return prediction;
  }

  async findByUser(userUuid: string): Promise<PredictionResponseDto[]> {
    const user = await this.usersService.findByUuid(userUuid);
    const predictions = await (this.prisma as any).prediction.findMany({
      where: { userId: user.id },
      include: { match: true },
      orderBy: { match: { kickoff: 'asc' } },
    });

    return predictions.map((p: any) => ({
      id: p.id,
      userId: p.userId,
      matchId: p.matchId,
      predictedHomeScore: p.predictedHomeScore,
      predictedAwayScore: p.predictedAwayScore,
      pointsEarned: p.pointsEarned,
      bonusPoints: p.bonusPoints,
      isCalculated: p.isCalculated,
      createdAt: p.createdAt,
      match: {
        homeTeam: p.match.homeTeam,
        awayTeam: p.match.awayTeam,
        homeScore: p.match.homeScore ?? undefined,
        awayScore: p.match.awayScore ?? undefined,
        kickoff: p.match.kickoff,
        status: p.match.status,
      },
    }));
  }

  async findByMatch(matchId: number): Promise<Prediction[]> {
    return (this.prisma as any).prediction.findMany({
      where: { matchId },
      include: { user: true },
    });
  }

  /**
   * Recalcule les points pour les pronostics des matchs termines.
   * Le calcul est idempotent: les lignes deja correctes sont laissees intactes,
   * les anciennes lignes calculees avec une mauvaise regle sont reparees.
   */
  async calculatePendingPoints(): Promise<{ calculated: number }> {
    const allPredictions = await (this.prisma as any).prediction.findMany({
      include: { match: true },
    });

    this.logger.log(`Total predictions en base: ${allPredictions.length}`);

    const toCalculate = allPredictions.filter((p: any) => {
      const hasHomeScore = p.match.homeScore !== null && p.match.homeScore !== undefined;
      const hasAwayScore = p.match.awayScore !== null && p.match.awayScore !== undefined;
      const isFinished = p.match.status === MatchStatus.FINISHED;

      this.logger.debug(
        `Prediction ${p.id} | isCalculated: ${p.isCalculated} | ` +
        `Match: ${p.match.homeTeam} vs ${p.match.awayTeam} | ` +
        `Status: ${p.match.status} | Score: ${p.match.homeScore} - ${p.match.awayScore} | ` +
        `canCalculate: ${isFinished && hasHomeScore && hasAwayScore}`,
      );

      return isFinished && hasHomeScore && hasAwayScore;
    });

    this.logger.log(`Predictions a verifier: ${toCalculate.length}`);

    let calculated = 0;

    for (const prediction of toCalculate) {
      const match = prediction.match;

      const matchForCalc = {
        ...match,
        homeScore: Number(match.homeScore),
        awayScore: Number(match.awayScore),
        homeOdds: match.homeOdds ? Number(match.homeOdds) : null,
        awayOdds: match.awayOdds ? Number(match.awayOdds) : null,
        drawOdds: match.drawOdds ? Number(match.drawOdds) : null,
      };

      const predForCalc = {
        ...prediction,
        predictedHomeScore: Number(prediction.predictedHomeScore),
        predictedAwayScore: Number(prediction.predictedAwayScore),
      };

      const result = this.calculator.calculate(predForCalc, matchForCalc);
      const needsUpdate =
        prediction.isCalculated !== true ||
        Number(prediction.pointsEarned) !== result.basePoints ||
        Number(prediction.bonusPoints) !== result.bonusPoints;

      if (!needsUpdate) continue;

      await (this.prisma as any).prediction.update({
        where: { id: prediction.id },
        data: {
          pointsEarned: result.basePoints,
          bonusPoints: result.bonusPoints,
          isCalculated: true,
        },
      });

      this.logger.log(
        `Updated ${match.homeTeam} ${matchForCalc.homeScore}-${matchForCalc.awayScore} ${match.awayTeam} | ` +
          `Prono: ${predForCalc.predictedHomeScore}-${predForCalc.predictedAwayScore} | ` +
          `Points: ${result.totalPoints} pts (${result.reason})`,
      );

      calculated++;
    }

    this.logger.log(`Calcul termine: ${calculated} predictions mises a jour`);
    return { calculated };
  }
}
