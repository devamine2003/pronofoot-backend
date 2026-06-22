import { MatchStatus } from '../common/prisma-types';
import { PointsCalculatorService } from './points-calculator.service';

const makeMatch = (homeScore: number, awayScore: number) =>
  ({
    homeScore,
    awayScore,
    homeOdds: null,
    awayOdds: null,
    drawOdds: null,
    status: MatchStatus.FINISHED,
  }) as any;

const makePrediction = (predictedHomeScore: number, predictedAwayScore: number) =>
  ({ predictedHomeScore, predictedAwayScore }) as any;

describe('PointsCalculatorService', () => {
  let service: PointsCalculatorService;

  beforeEach(() => {
    service = new PointsCalculatorService();
  });

  it('awards 5 points for an exact score', () => {
    const result = service.calculate(makePrediction(4, 0), makeMatch(4, 0));

    expect(result.basePoints).toBe(5);
    expect(result.totalPoints).toBe(5);
  });

  it('awards 3 points for the correct winner with a wrong score', () => {
    const result = service.calculate(makePrediction(2, 0), makeMatch(4, 0));

    expect(result.basePoints).toBe(3);
    expect(result.totalPoints).toBe(3);
  });

  it('awards 3 points for a correct draw with a wrong score', () => {
    const result = service.calculate(makePrediction(1, 1), makeMatch(2, 2));

    expect(result.basePoints).toBe(3);
    expect(result.totalPoints).toBe(3);
  });

  it('awards 0 points for the wrong result', () => {
    const result = service.calculate(makePrediction(0, 2), makeMatch(4, 0));

    expect(result.basePoints).toBe(0);
    expect(result.totalPoints).toBe(0);
  });
});