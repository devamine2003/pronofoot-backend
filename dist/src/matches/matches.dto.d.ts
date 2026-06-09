import { MatchStatus } from '../common/prisma-types';
export declare class MatchResponseDto {
    id: number;
    apiMatchId: string;
    homeTeam: string;
    awayTeam: string;
    homeFlag?: string;
    awayFlag?: string;
    kickoff: Date;
    status: MatchStatus;
    homeScore?: number;
    awayScore?: number;
    stage?: string;
    venue?: string;
    homeOdds?: number;
    drawOdds?: number;
    awayOdds?: number;
    isLocked: boolean;
}
