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
var SyncScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const matches_service_1 = require("../matches/matches.service");
let SyncScheduler = SyncScheduler_1 = class SyncScheduler {
    matchesService;
    logger = new common_1.Logger(SyncScheduler_1.name);
    isSyncing = false;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    async syncMatches() {
        if (this.isSyncing)
            return;
        this.isSyncing = true;
        try {
            this.logger.log('[CRON 15min] Sync matchs...');
            await this.matchesService.syncMatches();
            this.logger.log('[CRON 15min] Sync terminée');
        }
        catch (err) {
            this.logger.error('[CRON 15min] Erreur sync:', err?.message);
        }
        finally {
            this.isSyncing = false;
        }
    }
};
exports.SyncScheduler = SyncScheduler;
__decorate([
    (0, schedule_1.Cron)('0 */15 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SyncScheduler.prototype, "syncMatches", null);
exports.SyncScheduler = SyncScheduler = SyncScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], SyncScheduler);
//# sourceMappingURL=sync.scheduler.js.map