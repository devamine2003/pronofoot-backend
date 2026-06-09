import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class SyncScheduler {
  private readonly logger = new Logger(SyncScheduler.name);
  private isSyncing = false;

  constructor(private readonly matchesService: MatchesService) {}

  /**
   * Sync des matchs toutes les 15 minutes :
   * - Nouveaux matchs depuis l'API football
   * - Mise à jour des statuts (SCHEDULED → LIVE → FINISHED)
   * - Mise à jour des scores
   * - Mise à jour des cotes
   *
   * Le calcul des points est déclenché à la demande
   * quand un utilisateur visite la page du classement.
   */
  @Cron('0 */15 * * * *')
  async syncMatches() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      this.logger.log('[CRON 15min] Sync matchs...');
      await this.matchesService.syncMatches();
      this.logger.log('[CRON 15min] Sync terminée');
    } catch (err) {
      this.logger.error('[CRON 15min] Erreur sync:', err?.message);
    } finally {
      this.isSyncing = false;
    }
  }
}