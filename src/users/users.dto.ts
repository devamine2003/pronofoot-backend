import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrLoginUserDto {
  @ApiProperty({ example: 'Anas94', description: 'Pseudo unique de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  pseudo: string;
}

export class UserResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() uuid: string;
  @ApiProperty() pseudo: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() isNew: boolean;
}