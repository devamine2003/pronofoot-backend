import { PrismaService } from '../prisma/prisma.service';
import { FootballApiService } from '../football-api/football-api.service';
import { Match } from '../common/prisma-types';
import { MatchResponseDto } from './matches.dto';
export declare class MatchesService {
    private readonly prisma;
    private readonly footballApi;
    private readonly logger;
    constructor(prisma: PrismaService, footballApi: FootballApiService);
    syncMatches(): Promise<{
        created: number;
        updated: number;
        skipped: number;
    }>;
    findAll(): Promise<MatchResponseDto[]>;
    findById(id: number): Promise<MatchResponseDto>;
    findFinishedUncalculated(): Promise<Match[]>;
    private toResponseDto;
}
