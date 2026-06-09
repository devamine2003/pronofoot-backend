import { MatchesService } from './matches.service';
import { MatchResponseDto } from './matches.dto';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    findAll(): Promise<MatchResponseDto[]>;
    findOne(id: number): Promise<MatchResponseDto>;
    sync(): Promise<{
        created: number;
        updated: number;
        skipped: number;
    }>;
}
