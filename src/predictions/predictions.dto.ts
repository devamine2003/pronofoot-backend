import { IsInt, IsNotEmpty, IsString, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePredictionDto {
  @ApiProperty({ description: 'UUID of the user (from localStorage)', example: 'a1b2c3...' })
  @IsString()
  @IsNotEmpty()
  userUuid: string;

  @ApiProperty({ description: 'Internal match ID' })
  @IsInt()
  matchId: number;

  @ApiProperty({ description: 'Predicted home team score', minimum: 0, maximum: 20 })
  @IsInt()
  @Min(0)
  @Max(20)
  predictedHomeScore: number;

  @ApiProperty({ description: 'Predicted away team score', minimum: 0, maximum: 20 })
  @IsInt()
  @Min(0)
  @Max(20)
  predictedAwayScore: number;
}

export class PredictionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  matchId: number;

  @ApiProperty()
  predictedHomeScore: number;

  @ApiProperty()
  predictedAwayScore: number;

  @ApiProperty()
  pointsEarned: number;

  @ApiProperty()
  bonusPoints: number;

  @ApiProperty()
  isCalculated: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Match details' })
  match?: {
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    kickoff: Date;
    status: string;
  };
}
