export declare class CreatePredictionDto {
    userUuid: string;
    matchId: number;
    predictedHomeScore: number;
    predictedAwayScore: number;
}
export declare class PredictionResponseDto {
    id: number;
    userId: number;
    matchId: number;
    predictedHomeScore: number;
    predictedAwayScore: number;
    pointsEarned: number;
    bonusPoints: number;
    isCalculated: boolean;
    createdAt: Date;
    match?: {
        homeTeam: string;
        awayTeam: string;
        homeScore?: number;
        awayScore?: number;
        kickoff: Date;
        status: string;
    };
}
