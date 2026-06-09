import { Controller, Get, Param, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RankingService } from './ranking.service';
import { PredictionsService } from '../predictions/predictions.service';
import { MatchesService } from '../matches/matches.service';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
    private readonly predictionsService: PredictionsService,
    private readonly matchesService: MatchesService,
  ) {}

  /**
   * Retourne le classement sans recalcul.
   * Utilisé pour les lectures rapides (ex: widget, navbar).
   */
  @Get()
  @ApiOperation({ summary: 'Classement actuel' })
  getLeaderboard() {
    return this.rankingService.getLeaderboard();
  }

  @Get('user/:uuid')
  @ApiOperation({ summary: 'Stats détaillées d\'un utilisateur' })
  getUserStats(@Param('uuid') uuid: string) {
    return this.rankingService.getUserStats(uuid);
  }

  /**
   * Appelé automatiquement à chaque visite de la page classement.
   * 1. Calcule les points des prédictions non calculées
   * 2. Retourne le classement à jour
   *
   * Remplace avantageusement les cron jobs de calcul :
   * le classement est toujours frais au moment où on le consulte.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calcul des points + classement à jour (appelé à chaque visite)' })
  async refresh() {
    await this.predictionsService.calculatePendingPoints();
    return this.rankingService.getLeaderboard();
  }
}