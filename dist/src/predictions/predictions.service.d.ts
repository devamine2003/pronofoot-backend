import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PointsCalculatorService } from './points-calculator.service';
import { CreatePredictionDto, PredictionResponseDto } from './predictions.dto';
import { Prediction } from '../common/prisma-types';
export declare class PredictionsService {
    private readonly prisma;
    private readonly usersService;
    private readonly calculator;
    private readonly logger;
    constructor(prisma: PrismaService, usersService: UsersService, calculator: PointsCalculatorService);
    upsert(dto: CreatePredictionDto): Promise<Prediction>;
    findByUser(userUuid: string): Promise<PredictionResponseDto[]>;
    findByMatch(matchId: number): Promise<Prediction[]>;
    calculatePendingPoints(): Promise<{
        calculated: number;
    }>;
}
