import { IsNumber, Min, Max, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({ example: 4, description: 'Score from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @ApiPropertyOptional({ example: 'Great technology!' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}
