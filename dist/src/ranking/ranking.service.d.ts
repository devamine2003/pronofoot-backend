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
    pointsHistory: {
        matchId: number;
        points: number;
        date: Date;
    }[];
}
export declare class RankingService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getLeaderboard(): Promise<RankingEntry[]>;
    getUserStats(userUuid: string): Promise<UserStats>;
}
