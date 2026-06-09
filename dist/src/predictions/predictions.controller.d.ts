import { PredictionsService } from './predictions.service';
import { CreatePredictionDto, PredictionResponseDto } from './predictions.dto';
export declare class PredictionsController {
    private readonly predictionsService;
    constructor(predictionsService: PredictionsService);
    create(dto: CreatePredictionDto): Promise<import("../common/prisma-types").Prediction>;
    findByUser(uuid: string): Promise<PredictionResponseDto[]>;
    findByMatch(matchId: number): Promise<import("../common/prisma-types").Prediction[]>;
    calculate(): Promise<{
        calculated: number;
    }>;
}
