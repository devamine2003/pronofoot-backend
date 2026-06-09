import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MatchStatus } from '../common/prisma-types';

export class MatchResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() apiMatchId: string;
  @ApiProperty() homeTeam: string;
  @ApiProperty() awayTeam: string;
  @ApiPropertyOptional() homeFlag?: string;
  @ApiPropertyOptional() awayFlag?: string;
  @ApiProperty() kickoff: Date;
  @ApiProperty({ enum: MatchStatus }) status: MatchStatus;
  @ApiPropertyOptional() homeScore?: number;
  @ApiPropertyOptional() awayScore?: number;
  @ApiPropertyOptional() stage?: string;
  @ApiPropertyOptional() venue?: string;
  @ApiPropertyOptional() homeOdds?: number;
  @ApiPropertyOptional() drawOdds?: number;
  @ApiPropertyOptional() awayOdds?: number;
  @ApiProperty() isLocked: boolean;
}
