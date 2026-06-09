import { RankingService } from './ranking.service';
import { PredictionsService } from '../predictions/predictions.service';
import { MatchesService } from '../matches/matches.service';
export declare class RankingController {
    private readonly rankingService;
    private readonly predictionsService;
    private readonly matchesService;
    constructor(rankingService: RankingService, predictionsService: PredictionsService, matchesService: MatchesService);
    getLeaderboard(): Promise<import("./ranking.service").RankingEntry[]>;
    getUserStats(uuid: string): Promise<import("./ranking.service").UserStats>;
    refresh(): Promise<import("./ranking.service").RankingEntry[]>;
}
