/**
 * Manual type definitions mirroring the Prisma schema.
 * Used when `prisma generate` cannot run (e.g. CI without network access to Prisma CDN).
 * In production, replace these with the actual generated @prisma/client types.
 */

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  POSTPONED = 'POSTPONED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: number;
  uuid: string;
  firstname: string;
  lastname: string;
  createdAt: Date;
}

export interface Match {
  id: number;
  apiMatchId: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string | null;
  awayFlag: string | null;
  kickoff: Date;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  stage: string | null;
  venue: string | null;
  homeOdds: number | null;
  drawOdds: number | null;
  awayOdds: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prediction {
  id: number;
  userId: number;
  matchId: number;
  predictedHomeScore: number;
  predictedAwayScore: number;
  pointsEarned: number;
  bonusPoints: number;
  isCalculated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
