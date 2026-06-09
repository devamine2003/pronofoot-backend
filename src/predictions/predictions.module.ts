import { Module } from '@nestjs/common';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { PointsCalculatorService } from './points-calculator.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PredictionsController],
  providers: [PredictionsService, PointsCalculatorService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
