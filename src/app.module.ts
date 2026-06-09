import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MatchesModule } from './matches/matches.module';
import { PredictionsModule } from './predictions/predictions.module';
import { RankingModule } from './ranking/ranking.module';
import { FootballApiModule } from './football-api/football-api.module';
import { SyncScheduler } from './common/sync.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    FootballApiModule,
    UsersModule,
    MatchesModule,
    PredictionsModule,
    RankingModule,
  ],
  providers: [SyncScheduler],
})
export class AppModule {}