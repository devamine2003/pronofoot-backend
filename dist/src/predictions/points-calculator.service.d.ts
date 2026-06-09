import { Match, Prediction } from '../common/prisma-types';
export interface PointsResult {
    basePoints: number;
    bonusPoints: number;
    totalPoints: number;
    reason: string;
}
export declare class PointsCalculatorService {
    private readonly logger;
    calculate(prediction: Prediction, match: Match): PointsResult;
    private calculateSurpriseBonus;
    private getOutcome;
}
