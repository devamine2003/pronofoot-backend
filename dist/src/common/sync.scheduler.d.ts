import { MatchesService } from '../matches/matches.service';
export declare class SyncScheduler {
    private readonly matchesService;
    private readonly logger;
    private isSyncing;
    constructor(matchesService: MatchesService);
    syncMatches(): Promise<void>;
}
