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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FootballApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballApiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let FootballApiService = FootballApiService_1 = class FootballApiService {
    config;
    logger = new common_1.Logger(FootballApiService_1.name);
    client;
    competitionId;
    constructor(config) {
        this.config = config;
        this.competitionId = this.config.get('COMPETITION_ID', '2000');
        this.client = axios_1.default.create({
            baseURL: this.config.get('FOOTBALL_API_URL', 'https://api.football-data.org/v4'),
            headers: {
                'X-Auth-Token': this.config.get('FOOTBALL_API_KEY', ''),
            },
            timeout: 10000,
        });
    }
    async fetchMatches() {
        try {
            const response = await this.client.get(`/competitions/${this.competitionId}/matches`);
            this.logger.log(`Fetched ${response.data.matches.length} matches from API`);
            return response.data.matches;
        }
        catch (error) {
            this.logger.error('Failed to fetch matches', error?.message);
            throw error;
        }
    }
    async fetchMatch(matchId) {
        try {
            const response = await this.client.get(`/matches/${matchId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to fetch match ${matchId}`, error?.message);
            return null;
        }
    }
    mapStatus(apiStatus) {
        const statusMap = {
            SCHEDULED: 'SCHEDULED',
            TIMED: 'SCHEDULED',
            IN_PLAY: 'LIVE',
            PAUSED: 'LIVE',
            FINISHED: 'FINISHED',
            POSTPONED: 'POSTPONED',
            CANCELLED: 'CANCELLED',
            SUSPENDED: 'CANCELLED',
        };
        return statusMap[apiStatus] ?? 'SCHEDULED';
    }
    computeFallbackOdds(homeRank, awayRank) {
        const delta = homeRank - awayRank;
        const homeOdds = Math.max(1.3, 2.0 - delta * 0.05);
        const awayOdds = Math.max(1.3, 2.0 + delta * 0.05);
        const drawOdds = 3.2;
        return {
            homeWin: parseFloat(homeOdds.toFixed(2)),
            draw: drawOdds,
            awayWin: parseFloat(awayOdds.toFixed(2)),
        };
    }
};
exports.FootballApiService = FootballApiService;
exports.FootballApiService = FootballApiService = FootballApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FootballApiService);
//# sourceMappingURL=football-api.service.js.map