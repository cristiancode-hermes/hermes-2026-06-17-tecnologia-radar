import { IsString, MinLength, MaxLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'NestJS' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'A progressive Node.js framework' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ example: 'https://nestjs.com' })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'https://logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;
}
