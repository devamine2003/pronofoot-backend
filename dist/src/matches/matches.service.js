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
var MatchesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const football_api_service_1 = require("../football-api/football-api.service");
const prisma_types_1 = require("../common/prisma-types");
let MatchesService = MatchesService_1 = class MatchesService {
    prisma;
    footballApi;
    logger = new common_1.Logger(MatchesService_1.name);
    constructor(prisma, footballApi) {
        this.prisma = prisma;
        this.footballApi = footballApi;
    }
    async syncMatches() {
        this.logger.log('Starting match sync...');
        const apiMatches = await this.footballApi.fetchMatches();
        let created = 0;
        let updated = 0;
        let skipped = 0;
        for (const m of apiMatches) {
            const homeName = m.homeTeam?.shortName || m.homeTeam?.name;
            const awayName = m.awayTeam?.shortName || m.awayTeam?.name;
            if (!homeName || !awayName) {
                this.logger.debug(`Skip match ${m.id} — équipes non encore connues`);
                skipped++;
                continue;
            }
            const mappedStatus = this.footballApi.mapStatus(m.status);
            const isFinishedOrLive = ['FINISHED', 'LIVE'].includes(mappedStatus);
            const homeScore = isFinishedOrLive && m.score.fullTime.home !== null && m.score.fullTime.home !== undefined
                ? m.score.fullTime.home : null;
            const awayScore = isFinishedOrLive && m.score.fullTime.away !== null && m.score.fullTime.away !== undefined
                ? m.score.fullTime.away : null;
            const data = {
                homeTeam: homeName,
                awayTeam: awayName,
                homeFlag: m.homeTeam.crest ?? null,
                awayFlag: m.awayTeam.crest ?? null,
                kickoff: new Date(m.utcDate),
                status: mappedStatus,
                homeScore,
                awayScore,
                stage: m.stage ?? null,
                venue: m.venue ?? null,
                homeOdds: m.odds?.homeWin ?? null,
                drawOdds: m.odds?.draw ?? null,
                awayOdds: m.odds?.awayWin ?? null,
            };
            const existing = await this.prisma.match.findUnique({
                where: { apiMatchId: String(m.id) },
            });
            if (existing) {
                await this.prisma.match.update({
                    where: { apiMatchId: String(m.id) },
                    data,
                });
                updated++;
            }
            else {
                await this.prisma.match.create({
                    data: { apiMatchId: String(m.id), ...data },
                });
                created++;
            }
        }
        this.logger.log(`Sync complete: ${created} created, ${updated} updated, ${skipped} skipped`);
        return { created, updated, skipped };
    }
    async findAll() {
        const matches = await this.prisma.match.findMany({
            orderBy: { kickoff: 'asc' },
        });
        return matches.map((m) => this.toResponseDto(m));
    }
    async findById(id) {
        const match = await this.prisma.match.findUnique({ where: { id } });
        if (!match)
            throw new common_1.NotFoundException(`Match ${id} not found`);
        return this.toResponseDto(match);
    }
    async findFinishedUncalculated() {
        return this.prisma.match.findMany({
            where: {
                status: prisma_types_1.MatchStatus.FINISHED,
                predictions: { some: { isCalculated: false } },
            },
            include: { predictions: { where: { isCalculated: false } } },
        });
    }
    toResponseDto(m) {
        return {
            id: m.id,
            apiMatchId: m.apiMatchId,
            homeTeam: m.homeTeam,
            awayTeam: m.awayTeam,
            homeFlag: m.homeFlag ?? undefined,
            awayFlag: m.awayFlag ?? undefined,
            kickoff: m.kickoff,
            status: m.status,
            homeScore: m.homeScore ?? undefined,
            awayScore: m.awayScore ?? undefined,
            stage: m.stage ?? undefined,
            venue: m.venue ?? undefined,
            homeOdds: m.homeOdds ?? undefined,
            drawOdds: m.drawOdds ?? undefined,
            awayOdds: m.awayOdds ?? undefined,
            isLocked: m.kickoff <= new Date(),
        };
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = MatchesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        football_api_service_1.FootballApiService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map