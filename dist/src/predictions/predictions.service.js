"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PredictionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const points_calculator_service_1 = require("./points-calculator.service");
const prisma_types_1 = require("../common/prisma-types");
let PredictionsService = PredictionsService_1 = class PredictionsService {
    prisma;
    usersService;
    calculator;
    logger = new common_1.Logger(PredictionsService_1.name);
    constructor(prisma, usersService, calculator) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.calculator = calculator;
    }
    async upsert(dto) {
        const user = await this.usersService.findByUuid(dto.userUuid);
        const match = await this.prisma.match.findUnique({ where: { id: dto.matchId } });
        if (!match)
            throw new common_1.NotFoundException(`Match ${dto.matchId} not found`);
        if (match.kickoff <= new Date()) {
            throw new common_1.BadRequestException('Predictions are locked after kickoff');
        }
        if (match.status === prisma_types_1.MatchStatus.FINISHED || match.status === prisma_types_1.MatchStatus.CANCELLED) {
            throw new common_1.BadRequestException(`Cannot predict a ${match.status} match`);
        }
        const prediction = await this.prisma.prediction.upsert({
            where: { userId_matchId: { userId: user.id, matchId: dto.matchId } },
            create: {
                userId: user.id,
                matchId: dto.matchId,
                predictedHomeScore: dto.predictedHomeScore,
                predictedAwayScore: dto.predictedAwayScore,
            },
            update: {
                predictedHomeScore: dto.predictedHomeScore,
                predictedAwayScore: dto.predictedAwayScore,
                isCalculated: false,
                pointsEarned: 0,
                bonusPoints: 0,
            },
        });
        this.logger.log(`Prediction saved: user ${user.uuid} → match ${dto.matchId}`);
        return prediction;
    }
    async findByUser(userUuid) {
        const user = await this.usersService.findByUuid(userUuid);
        const predictions = await this.prisma.prediction.findMany({
            where: { userId: user.id },
            include: { match: true },
            orderBy: { match: { kickoff: 'asc' } },
        });
        return predictions.map((p) => ({
            id: p.id,
            userId: p.userId,
            matchId: p.matchId,
            predictedHomeScore: p.predictedHomeScore,
            predictedAwayScore: p.predictedAwayScore,
            pointsEarned: p.pointsEarned,
            bonusPoints: p.bonusPoints,
            isCalculated: p.isCalculated,
            createdAt: p.createdAt,
            match: {
                homeTeam: p.match.homeTeam,
                awayTeam: p.match.awayTeam,
                homeScore: p.match.homeScore ?? undefined,
                awayScore: p.match.awayScore ?? undefined,
                kickoff: p.match.kickoff,
                status: p.match.status,
            },
        }));
    }
    async findByMatch(matchId) {
        return this.prisma.prediction.findMany({
            where: { matchId },
            include: { user: true },
        });
    }
    async calculatePendingPoints() {
        const allPredictions = await this.prisma.prediction.findMany({
            include: { match: true },
        });
        this.logger.log(`Total predictions en base: ${allPredictions.length}`);
        const toCalculate = allPredictions.filter((p) => {
            const hasHomeScore = p.match.homeScore !== null && p.match.homeScore !== undefined;
            const hasAwayScore = p.match.awayScore !== null && p.match.awayScore !== undefined;
            const isFinished = p.match.status === prisma_types_1.MatchStatus.FINISHED;
            this.logger.debug(`Prediction ${p.id} | isCalculated: ${p.isCalculated} | ` +
                `Match: ${p.match.homeTeam} vs ${p.match.awayTeam} | ` +
                `Status: ${p.match.status} | Score: ${p.match.homeScore} - ${p.match.awayScore} | ` +
                `canCalculate: ${isFinished && hasHomeScore && hasAwayScore}`);
            return isFinished && hasHomeScore && hasAwayScore;
        });
        this.logger.log(`Predictions a verifier: ${toCalculate.length}`);
        let calculated = 0;
        for (const prediction of toCalculate) {
            const match = prediction.match;
            const matchForCalc = {
                ...match,
                homeScore: Number(match.homeScore),
                awayScore: Number(match.awayScore),
                homeOdds: match.homeOdds ? Number(match.homeOdds) : null,
                awayOdds: match.awayOdds ? Number(match.awayOdds) : null,
                drawOdds: match.drawOdds ? Number(match.drawOdds) : null,
            };
            const predForCalc = {
                ...prediction,
                predictedHomeScore: Number(prediction.predictedHomeScore),
                predictedAwayScore: Number(prediction.predictedAwayScore),
            };
            const result = this.calculator.calculate(predForCalc, matchForCalc);
            const needsUpdate = prediction.isCalculated !== true ||
                Number(prediction.pointsEarned) !== result.basePoints ||
                Number(prediction.bonusPoints) !== result.bonusPoints;
            if (!needsUpdate)
                continue;
            await this.prisma.prediction.update({
                where: { id: prediction.id },
                data: {
                    pointsEarned: result.basePoints,
                    bonusPoints: result.bonusPoints,
                    isCalculated: true,
                },
            });
            this.logger.log(`Updated ${match.homeTeam} ${matchForCalc.homeScore}-${matchForCalc.awayScore} ${match.awayTeam} | ` +
                `Prono: ${predForCalc.predictedHomeScore}-${predForCalc.predictedAwayScore} | ` +
                `Points: ${result.totalPoints} pts (${result.reason})`);
            calculated++;
        }
        this.logger.log(`Calcul termine: ${calculated} predictions mises a jour`);
        return { calculated };
    }
};
exports.PredictionsService = PredictionsService;
exports.PredictionsService = PredictionsService = PredictionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        points_calculator_service_1.PointsCalculatorService])
], PredictionsService);
//# sourceMappingURL=predictions.service.js.map