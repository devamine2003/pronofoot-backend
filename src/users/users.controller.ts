import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateOrLoginUserDto, UserResponseDto } from './users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion / inscription par pseudo' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  createOrLogin(@Body() dto: CreateOrLoginUserDto) {
    return this.usersService.createOrLogin(dto);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Récupérer un utilisateur par UUID' })
  findByUuid(@Param('uuid') uuid: string) {
    return this.usersService.findByUuid(uuid);
  }
}