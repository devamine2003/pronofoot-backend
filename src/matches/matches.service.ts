import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FootballApiService } from '../football-api/football-api.service';
import { Match, MatchStatus } from '../common/prisma-types';
import { MatchResponseDto } from './matches.dto';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly footballApi: FootballApiService,
  ) {}

  async syncMatches(): Promise<{ created: number; updated: number; skipped: number }> {
    this.logger.log('Starting match sync...');
    const apiMatches = await this.footballApi.fetchMatches();
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const m of apiMatches) {
      // Ignore les matchs sans équipes connues (phases élim. pas encore déterminées)
      const homeName = m.homeTeam?.shortName || m.homeTeam?.name;
      const awayName = m.awayTeam?.shortName || m.awayTeam?.name;

      if (!homeName || !awayName) {
        this.logger.debug(`Skip match ${m.id} — équipes non encore connues`);
        skipped++;
        continue;
      }

      const mappedStatus = this.footballApi.mapStatus(m.status) as MatchStatus;

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

      const existing = await (this.prisma as any).match.findUnique({
        where: { apiMatchId: String(m.id) },
      });

      if (existing) {
        await (this.prisma as any).match.update({
          where: { apiMatchId: String(m.id) },
          data,
        });
        updated++;
      } else {
        await (this.prisma as any).match.create({
          data: { apiMatchId: String(m.id), ...data },
        });
        created++;
      }
    }

    this.logger.log(`Sync complete: ${created} created, ${updated} updated, ${skipped} skipped`);
    return { created, updated, skipped };
  }

  async findAll(): Promise<MatchResponseDto[]> {
    const matches = await (this.prisma as any).match.findMany({
      orderBy: { kickoff: 'asc' },
    });
    return matches.map((m: Match) => this.toResponseDto(m));
  }

  async findById(id: number): Promise<MatchResponseDto> {
    const match = await (this.prisma as any).match.findUnique({ where: { id } });
    if (!match) throw new NotFoundException(`Match ${id} not found`);
    return this.toResponseDto(match);
  }

  async findFinishedUncalculated(): Promise<Match[]> {
    return (this.prisma as any).match.findMany({
      where: {
        status: MatchStatus.FINISHED,
        predictions: { some: { isCalculated: false } },
      },
      include: { predictions: { where: { isCalculated: false } } },
    });
  }

  private toResponseDto(m: Match): MatchResponseDto {
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
}