"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PointsCalculatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsCalculatorService = void 0;
const common_1 = require("@nestjs/common");
let PointsCalculatorService = PointsCalculatorService_1 = class PointsCalculatorService {
    logger = new common_1.Logger(PointsCalculatorService_1.name);
    calculate(prediction, match) {
        const { predictedHomeScore: ph, predictedAwayScore: pa } = prediction;
        const ah = match.homeScore;
        const aa = match.awayScore;
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
    calculateSurpriseBonus(match, outcome) {
        if (!match.homeOdds || !match.awayOdds)
            return 0;
        const actualOutcome = this.getOutcome(match.homeScore, match.awayScore);
        const winnerOdds = actualOutcome === 'home' ? match.homeOdds
            : actualOutcome === 'away' ? match.awayOdds
                : match.drawOdds ?? 3.0;
        if (outcome !== actualOutcome && outcome !== 'exact')
            return 0;
        if (winnerOdds >= 8.0)
            return 5;
        if (winnerOdds >= 6.0)
            return 4;
        if (winnerOdds >= 4.5)
            return 3;
        if (winnerOdds >= 3.5)
            return 2;
        if (winnerOdds >= 2.5)
            return 1;
        return 0;
    }
    getOutcome(homeScore, awayScore) {
        if (homeScore > awayScore)
            return 'home';
        if (homeScore < awayScore)
            return 'away';
        return 'draw';
    }
};
exports.PointsCalculatorService = PointsCalculatorService;
exports.PointsCalculatorService = PointsCalculatorService = PointsCalculatorService_1 = __decorate([
    (0, common_1.Injectable)()
], PointsCalculatorService);
//# sourceMappingURL=points-calculator.service.js.map