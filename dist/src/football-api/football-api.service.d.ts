import { ConfigService } from '@nestjs/config';
export interface FootballMatch {
    id: number;
    utcDate: string;
    status: string;
    stage: string;
    group?: string;
    homeTeam: {
        id: number;
        name: string;
        shortName: string;
        crest: string;
    };
    awayTeam: {
        id: number;
        name: string;
        shortName: string;
        crest: string;
    };
    score: {
        winner: string | null;
        fullTime: {
            home: number | null;
            away: number | null;
        };
        halfTime: {
            home: number | null;
            away: number | null;
        };
    };
    venue?: string;
    odds?: {
        homeWin: number;
        draw: number;
        awayWin: number;
    };
}
export interface FootballApiResponse {
    matches: FootballMatch[];
}
export declare class FootballApiService {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly competitionId;
    constructor(config: ConfigService);
    fetchMatches(): Promise<FootballMatch[]>;
    fetchMatch(matchId: string): Promise<FootballMatch | null>;
    mapStatus(apiStatus: string): string;
    computeFallbackOdds(homeRank: number, awayRank: number): {
        homeWin: number;
        draw: number;
        awayWin: number;
    };
}
