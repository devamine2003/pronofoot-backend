import { Injectable, Logger } from '@nestjs/common';
import { Match, Prediction } from '../common/prisma-types';

export interface PointsResult {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  reason: string;
}

@Injectable()
export class PointsCalculatorService {
  private readonly logger = new Logger(PointsCalculatorService.name);

  calculate(prediction: Prediction, match: Match): PointsResult {
    const { predictedHomeScore: ph, predictedAwayScore: pa } = prediction;
    const ah = match.homeScore!;
    const aa = match.awayScore!;

    if (ph === ah && pa === aa) {
      const bonus = this.calculateSurpriseBonus(match, 'exact');
      return {
        basePoints: 5,
        bonusPoints: bonus,
        totalPoints: 5 + bonus,
        reason: bonus > 0 ? `Score exact + bonus surprise (+${bonus})` : 'Score exact',
      };
    }

    const predictedOutcome = this.getOutcome(ph, pa);
    const actualOutcome = this.getOutcome(ah, aa);

    if (predictedOutcome === actualOutcome) {
      const bonus = this.calculateSurpriseBonus(match, predictedOutcome);
      return {
        basePoints: 3,
        bonusPoints: bonus,
        totalPoints: 3 + bonus,
        reason: bonus > 0
          ? `Bon résultat (${predictedOutcome}) + bonus surprise (+${bonus})`
          : `Bon résultat (${predictedOutcome})`,
      };
    }

    return { basePoints: 0, bonusPoints: 0, totalPoints: 0, reason: 'Mauvais résultat' };
  }

  private calculateSurpriseBonus(match: Match, outcome: string): number {
    if (!match.homeOdds || !match.awayOdds) return 0;

    const actualOutcome = this.getOutcome(match.homeScore!, match.awayScore!);
    const winnerOdds =
      actualOutcome === 'home' ? match.homeOdds
      : actualOutcome === 'away' ? match.awayOdds
      : match.drawOdds ?? 3.0;

    if (outcome !== actualOutcome && outcome !== 'exact') return 0;

    if (winnerOdds >= 8.0) return 5;
    if (winnerOdds >= 6.0) return 4;
    if (winnerOdds >= 4.5) return 3;
    if (winnerOdds >= 3.5) return 2;
    if (winnerOdds >= 2.5) return 1;
    return 0;
  }

  private getOutcome(homeScore: number, awayScore: number): 'home' | 'away' | 'draw' {
    if (homeScore > awayScore) return 'home';
    if (homeScore < awayScore) return 'away';
    return 'draw';
  }
}
