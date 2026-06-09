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
   * Calcule les points pour toutes les prédictions non calculées.
   * On récupère TOUT sans filtre Prisma complexe, puis on filtre en JS.
   */
  async calculatePendingPoints(): Promise<{ calculated: number }> {
    // Étape 1 : récupère TOUTES les prédictions avec leur match
    const allPredictions = await (this.prisma as any).prediction.findMany({
      include: { match: true },
    });

    this.logger.log(`Total prédictions en base: ${allPredictions.length}`);

    // Étape 2 : filtre en JavaScript — non calculées ET match avec scores
    const toCalculate = allPredictions.filter((p: any) => {
      const notCalculated = p.isCalculated === false || p.isCalculated === 0;
      const hasHomeScore = p.match.homeScore !== null && p.match.homeScore !== undefined;
      const hasAwayScore = p.match.awayScore !== null && p.match.awayScore !== undefined;

      this.logger.debug(
        `Prédiction ${p.id} | isCalculated: ${p.isCalculated} | ` +
        `Match: ${p.match.homeTeam} vs ${p.match.awayTeam} | ` +
        `Score: ${p.match.homeScore} - ${p.match.awayScore} | ` +
        `notCalculated: ${notCalculated} | hasScores: ${hasHomeScore && hasAwayScore}`
      );

      return notCalculated && hasHomeScore && hasAwayScore;
    });

    this.logger.log(`Prédictions à calculer: ${toCalculate.length}`);

    let calculated = 0;

    for (const prediction of toCalculate) {
      const match = prediction.match;

      // Convertit explicitement en nombre pour éviter les problèmes de type
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

      await (this.prisma as any).prediction.update({
        where: { id: prediction.id },
        data: {
          pointsEarned: result.basePoints,
          bonusPoints: result.bonusPoints,
          isCalculated: true,
        },
      });

      this.logger.log(
        `✓ ${match.homeTeam} ${matchForCalc.homeScore}-${matchForCalc.awayScore} ${match.awayTeam} | ` +
        `Prono: ${predForCalc.predictedHomeScore}-${predForCalc.predictedAwayScore} | ` +
        `Points: ${result.totalPoints} pts (${result.reason})`
      );

      calculated++;
    }

    this.logger.log(`Calcul terminé: ${calculated} prédictions traitées`);
    return { calculated };
  }
}