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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionResponseDto = exports.CreatePredictionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePredictionDto {
    userUuid;
    matchId;
    predictedHomeScore;
    predictedAwayScore;
}
exports.CreatePredictionDto = CreatePredictionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID of the user (from localStorage)', example: 'a1b2c3...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePredictionDto.prototype, "userUuid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Internal match ID' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePredictionDto.prototype, "matchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Predicted home team score', minimum: 0, maximum: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreatePredictionDto.prototype, "predictedHomeScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Predicted away team score', minimum: 0, maximum: 20 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], CreatePredictionDto.prototype, "predictedAwayScore", void 0);
class PredictionResponseDto {
    id;
    userId;
    matchId;
    predictedHomeScore;
    predictedAwayScore;
    pointsEarned;
    bonusPoints;
    isCalculated;
    createdAt;
    match;
}
exports.PredictionResponseDto = PredictionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PredictionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PredictionResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PredictionResponseDto.prototype, "matchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PredictionResponseDto.prototype, "predictedHomeScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PredictionResponseDto.prototype, "predictedAwayScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PredictionResponseDto.prototype, "pointsEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PredictionResponseDto.prototype, "bonusPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PredictionResponseDto.prototype, "isCalculated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PredictionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Match details' }),
    __metadata("design:type", Object)
], PredictionResponseDto.prototype, "match", void 0);
//# sourceMappingURL=predictions.dto.js.map