import { Controller, Get, Param, ParseIntPipe, Query, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MatchesService } from './matches.service';
import { MatchResponseDto } from './matches.dto';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all World Cup matches' })
  @ApiResponse({ status: 200, type: [MatchResponseDto] })
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiResponse({ status: 200, type: MatchResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.findById(id);
  }

  /**
   * Admin-only endpoint to manually trigger a sync.
   * In production, protect this with an API key guard.
   */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually trigger match sync from football API' })
  sync() {
    return this.matchesService.syncMatches();
  }
}
