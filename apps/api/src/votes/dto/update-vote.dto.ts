import { IsNumber, Min, Max, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVoteDto {
  @ApiPropertyOptional({ example: 4, description: 'Score from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  score?: number;

  @ApiPropertyOptional({ example: 'Updated comment' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}
