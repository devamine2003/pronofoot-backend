import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PredictionsService } from './predictions.service';
import { CreatePredictionDto, PredictionResponseDto } from './predictions.dto';

@ApiTags('Predictions')
@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  /**
   * Submit or update a prediction.
   * Idempotent: calling twice overwrites the first.
   * Returns 400 if match already kicked off.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit or update a prediction for a match' })
  @ApiResponse({ status: 201, description: 'Prediction saved' })
  @ApiResponse({ status: 400, description: 'Match locked or invalid' })
  @ApiResponse({ status: 404, description: 'User or match not found' })
  create(@Body() dto: CreatePredictionDto) {
    return this.predictionsService.upsert(dto);
  }

  /**
   * Get all predictions for a user.
   * Frontend passes the UUID stored in localStorage.
   */
  @Get('user/:uuid')
  @ApiOperation({ summary: 'Get predictions for a user by UUID' })
  @ApiResponse({ status: 200, type: [PredictionResponseDto] })
  findByUser(@Param('uuid') uuid: string) {
    return this.predictionsService.findByUser(uuid);
  }

  /**
   * Get all predictions for a specific match.
   */
  @Get('match/:matchId')
  @ApiOperation({ summary: 'Get all predictions for a match' })
  findByMatch(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.predictionsService.findByMatch(matchId);
  }

  /**
   * Admin: manually trigger points calculation.
   */
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger points calculation for finished matches' })
  calculate() {
    return this.predictionsService.calculatePendingPoints();
  }
}
