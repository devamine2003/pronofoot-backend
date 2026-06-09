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
exports.MatchResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const prisma_types_1 = require("../common/prisma-types");
class MatchResponseDto {
    id;
    apiMatchId;
    homeTeam;
    awayTeam;
    homeFlag;
    awayFlag;
    kickoff;
    status;
    homeScore;
    awayScore;
    stage;
    venue;
    homeOdds;
    drawOdds;
    awayOdds;
    isLocked;
}
exports.MatchResponseDto = MatchResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "apiMatchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "homeTeam", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "awayTeam", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "homeFlag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "awayFlag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MatchResponseDto.prototype, "kickoff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: prisma_types_1.MatchStatus }),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "homeScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "awayScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], MatchResponseDto.prototype, "venue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "homeOdds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "drawOdds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], MatchResponseDto.prototype, "awayOdds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], MatchResponseDto.prototype, "isLocked", void 0);
//# sourceMappingURL=matches.dto.js.map