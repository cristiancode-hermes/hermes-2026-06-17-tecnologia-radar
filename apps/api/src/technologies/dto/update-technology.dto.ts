import { IsString, MinLength, MaxLength, IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTechnologyDto {
  @ApiPropertyOptional({ example: 'NestJS' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'A progressive Node.js framework' })
  @IsString()
  @MinLength(10)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://nestjs.com' })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'https://logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
