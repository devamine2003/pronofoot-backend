import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface FootballMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group?: string;
  homeTeam: { id: number; name: string; shortName: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; crest: string };
  score: {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
  venue?: string;
  odds?: { homeWin: number; draw: number; awayWin: number };
}

export interface FootballApiResponse {
  matches: FootballMatch[];
}

@Injectable()
export class FootballApiService {
  private readonly logger = new Logger(FootballApiService.name);
  private readonly client: AxiosInstance;
  private readonly competitionId: string;

  constructor(private readonly config: ConfigService) {
    this.competitionId = this.config.get<string>('COMPETITION_ID', '2000');

    this.client = axios.create({
      baseURL: this.config.get<string>('FOOTBALL_API_URL', 'https://api.football-data.org/v4'),
      headers: {
        'X-Auth-Token': this.config.get<string>('FOOTBALL_API_KEY', ''),
      },
      timeout: 10000,
    });
  }

  /**
   * Fetch all matches for the World Cup competition.
   */
  async fetchMatches(): Promise<FootballMatch[]> {
    try {
      const response = await this.client.get<FootballApiResponse>(
        `/competitions/${this.competitionId}/matches`,
      );
      this.logger.log(`Fetched ${response.data.matches.length} matches from API`);
      return response.data.matches;
    } catch (error) {
      this.logger.error('Failed to fetch matches', error?.message);
      throw error;
    }
  }

  /**
   * Fetch a single match by ID (for live score updates).
   */
  async fetchMatch(matchId: string): Promise<FootballMatch | null> {
    try {
      const response = await this.client.get<FootballMatch>(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch match ${matchId}`, error?.message);
      return null;
    }
  }

  /**
   * Map football-data.org status string to our internal enum.
   */
  mapStatus(apiStatus: string): string {
    const statusMap: Record<string, string> = {
      SCHEDULED: 'SCHEDULED',
      TIMED: 'SCHEDULED',
      IN_PLAY: 'LIVE',
      PAUSED: 'LIVE',
      FINISHED: 'FINISHED',
      POSTPONED: 'POSTPONED',
      CANCELLED: 'CANCELLED',
      SUSPENDED: 'CANCELLED',
    };
    return statusMap[apiStatus] ?? 'SCHEDULED';
  }

  /**
   * Derive rough odds from FIFA world ranking or fallback to default.
   * Used when the API doesn't provide real odds.
   * Formula: higher-ranked team gets lower odds (more likely to win).
   */
  computeFallbackOdds(homeRank: number, awayRank: number): { homeWin: number; draw: number; awayWin: number } {
    // Simple model: odds inversely proportional to rank delta
    const delta = homeRank - awayRank;
    const homeOdds = Math.max(1.3, 2.0 - delta * 0.05);
    const awayOdds = Math.max(1.3, 2.0 + delta * 0.05);
    const drawOdds = 3.2;
    return {
      homeWin: parseFloat(homeOdds.toFixed(2)),
      draw: drawOdds,
      awayWin: parseFloat(awayOdds.toFixed(2)),
    };
  }
}
