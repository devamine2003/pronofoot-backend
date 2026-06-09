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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ranking_service_1 = require("./ranking.service");
const predictions_service_1 = require("../predictions/predictions.service");
const matches_service_1 = require("../matches/matches.service");
let RankingController = class RankingController {
    rankingService;
    predictionsService;
    matchesService;
    constructor(rankingService, predictionsService, matchesService) {
        this.rankingService = rankingService;
        this.predictionsService = predictionsService;
        this.matchesService = matchesService;
    }
    getLeaderboard() {
        return this.rankingService.getLeaderboard();
    }
    getUserStats(uuid) {
        return this.rankingService.getUserStats(uuid);
    }
    async refresh() {
        await this.predictionsService.calculatePendingPoints();
        return this.rankingService.getLeaderboard();
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Classement actuel' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('user/:uuid'),
    (0, swagger_1.ApiOperation)({ summary: 'Stats détaillées d\'un utilisateur' }),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Calcul des points + classement à jour (appelé à chaque visite)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "refresh", null);
exports.RankingController = RankingController = __decorate([
    (0, swagger_1.ApiTags)('Ranking'),
    (0, common_1.Controller)('ranking'),
    __metadata("design:paramtypes", [ranking_service_1.RankingService,
        predictions_service_1.PredictionsService,
        matches_service_1.MatchesService])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map