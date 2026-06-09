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
exports.PredictionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const predictions_service_1 = require("./predictions.service");
const predictions_dto_1 = require("./predictions.dto");
let PredictionsController = class PredictionsController {
    predictionsService;
    constructor(predictionsService) {
        this.predictionsService = predictionsService;
    }
    create(dto) {
        return this.predictionsService.upsert(dto);
    }
    findByUser(uuid) {
        return this.predictionsService.findByUser(uuid);
    }
    findByMatch(matchId) {
        return this.predictionsService.findByMatch(matchId);
    }
    calculate() {
        return this.predictionsService.calculatePendingPoints();
    }
};
exports.PredictionsController = PredictionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Submit or update a prediction for a match' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prediction saved' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Match locked or invalid' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or match not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [predictions_dto_1.CreatePredictionDto]),
    __metadata("design:returntype", void 0)
], PredictionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('user/:uuid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get predictions for a user by UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [predictions_dto_1.PredictionResponseDto] }),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PredictionsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('match/:matchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all predictions for a match' }),
    __param(0, (0, common_1.Param)('matchId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PredictionsController.prototype, "findByMatch", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger points calculation for finished matches' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PredictionsController.prototype, "calculate", null);
exports.PredictionsController = PredictionsController = __decorate([
    (0, swagger_1.ApiTags)('Predictions'),
    (0, common_1.Controller)('predictions'),
    __metadata("design:paramtypes", [predictions_service_1.PredictionsService])
], PredictionsController);
//# sourceMappingURL=predictions.controller.js.map