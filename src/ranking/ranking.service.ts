import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RankingEntry {
  position: number;
  userId: number;
  uuid: string;
  pseudo: string;
  totalPoints: number;
  totalPredictions: number;
  correctResults: number;
  exactScores: number;
  bonusPoints: number;
}

export interface UserStats extends RankingEntry {
  pointsHistory: { matchId: number; points: number; date: Date }[];
}

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard(): Promise<RankingEntry[]> {
    // Tous les utilisateurs, même sans prédictions
    const users = await (this.prisma as any).user.findMany({
      include: {
        predictions: {
          include: { match: true },
        },
      },
    });

    const entries = users.map((user: any) => {
      const calculated = user.predictions.filter((p: any) => p.isCalculated);

      const totalPoints = calculated.reduce(
        (s: number, p: any) => s + p.pointsEarned + p.bonusPoints, 0
      );
      const exactScores = calculated.filter(
        (p: any) =>
          p.match.homeScore !== null &&
          p.predictedHomeScore === p.match.homeScore &&
          p.predictedAwayScore === p.match.awayScore,
      ).length;
      const correctResults = calculated.filter(
        (p: any) => p.pointsEarned >= 3
      ).length;
      const bonusPoints = calculated.reduce(
        (s: number, p: any) => s + p.bonusPoints, 0
      );

      return {
        position: 0,
        userId: user.id,
        uuid: user.uuid,
        pseudo: user.pseudo,
        totalPoints,
        totalPredictions: user.predictions.length,
        correctResults,
        exactScores,
        bonusPoints,
      };
    });

    // Tri: points DESC, puis exactScores DESC
    entries.sort((a: any, b: any) =>
      b.totalPoints !== a.totalPoints
        ? b.totalPoints - a.totalPoints
        : b.exactScores - a.exactScores
    );

    // Attribution des positions avec gestion des ex-aequo
    let pos = 1;
    for (let i = 0; i < entries.length; i++) {
      if (
        i > 0 &&
        entries[i].totalPoints === entries[i - 1].totalPoints &&
        entries[i].exactScores === entries[i - 1].exactScores
      ) {
        entries[i].position = entries[i - 1].position;
      } else {
        entries[i].position = pos;
      }
      pos++;
    }

    return entries;
  }

  async getUserStats(userUuid: string): Promise<UserStats> {
    const user = await (this.prisma as any).user.findUnique({
      where: { uuid: userUuid },
      include: {
        predictions: {
          include: { match: true },
          orderBy: { match: { kickoff: 'asc' } },
        },
      },
    });

    if (!user) throw new NotFoundException(`User ${userUuid} not found`);

    const calculated = user.predictions.filter((p: any) => p.isCalculated);
    const totalPoints = calculated.reduce(
      (s: number, p: any) => s + p.pointsEarned + p.bonusPoints, 0
    );
    const exactScores = calculated.filter(
      (p: any) =>
        p.match.homeScore !== null &&
        p.predictedHomeScore === p.match.homeScore &&
        p.predictedAwayScore === p.match.awayScore,
    ).length;
    const correctResults = calculated.filter(
      (p: any) => p.pointsEarned >= 3
    ).length;
    const bonusPoints = calculated.reduce(
      (s: number, p: any) => s + p.bonusPoints, 0
    );

    const leaderboard = await this.getLeaderboard();
    const entry = leaderboard.find((e) => e.uuid === userUuid);
    const position = entry?.position ?? leaderboard.length + 1;

    const pointsHistory = calculated.map((p: any) => ({
      matchId: p.matchId,
      points: p.pointsEarned + p.bonusPoints,
      date: p.match.kickoff,
    }));

    return {
      position,
      userId: user.id,
      uuid: user.uuid,
      pseudo: user.pseudo,
      totalPoints,
      totalPredictions: user.predictions.length,
      correctResults,
      exactScores,
      bonusPoints,
      pointsHistory,
    };
  }
}