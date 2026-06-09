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
var RankingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RankingService = RankingService_1 = class RankingService {
    prisma;
    logger = new common_1.Logger(RankingService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLeaderboard() {
        const users = await this.prisma.user.findMany({
            include: {
                predictions: {
                    include: { match: true },
                },
            },
        });
        const entries = users.map((user) => {
            const calculated = user.predictions.filter((p) => p.isCalculated);
            const totalPoints = calculated.reduce((s, p) => s + p.pointsEarned + p.bonusPoints, 0);
            const exactScores = calculated.filter((p) => p.match.homeScore !== null &&
                p.predictedHomeScore === p.match.homeScore &&
                p.predictedAwayScore === p.match.awayScore).length;
            const correctResults = calculated.filter((p) => p.pointsEarned >= 3).length;
            const bonusPoints = calculated.reduce((s, p) => s + p.bonusPoints, 0);
            return {
                position: 0,
                userId: user.id,
                uuid: user.uuid,
                pseudo: user.pseudo,
                totalPoints,
                totalPredictions: user.predictions.length,
                correctResults,
                exactScores,
                bonusPoints,
            };
        });
        entries.sort((a, b) => b.totalPoints !== a.totalPoints
            ? b.totalPoints - a.totalPoints
            : b.exactScores - a.exactScores);
        let pos = 1;
        for (let i = 0; i < entries.length; i++) {
            if (i > 0 &&
                entries[i].totalPoints === entries[i - 1].totalPoints &&
                entries[i].exactScores === entries[i - 1].exactScores) {
                entries[i].position = entries[i - 1].position;
            }
            else {
                entries[i].position = pos;
            }
            pos++;
        }
        return entries;
    }
    async getUserStats(userUuid) {
        const user = await this.prisma.user.findUnique({
            where: { uuid: userUuid },
            include: {
                predictions: {
                    include: { match: true },
                    orderBy: { match: { kickoff: 'asc' } },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException(`User ${userUuid} not found`);
        const calculated = user.predictions.filter((p) => p.isCalculated);
        const totalPoints = calculated.reduce((s, p) => s + p.pointsEarned + p.bonusPoints, 0);
        const exactScores = calculated.filter((p) => p.match.homeScore !== null &&
            p.predictedHomeScore === p.match.homeScore &&
            p.predictedAwayScore === p.match.awayScore).length;
        const correctResults = calculated.filter((p) => p.pointsEarned >= 3).length;
        const bonusPoints = calculated.reduce((s, p) => s + p.bonusPoints, 0);
        const leaderboard = await this.getLeaderboard();
        const entry = leaderboard.find((e) => e.uuid === userUuid);
        const position = entry?.position ?? leaderboard.length + 1;
        const pointsHistory = calculated.map((p) => ({
            matchId: p.matchId,
            points: p.pointsEarned + p.bonusPoints,
            date: p.match.kickoff,
        }));
        return {
            position,
            userId: user.id,
            uuid: user.uuid,
            pseudo: user.pseudo,
            totalPoints,
            totalPredictions: user.predictions.length,
            correctResults,
            exactScores,
            bonusPoints,
            pointsHistory,
        };
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = RankingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map