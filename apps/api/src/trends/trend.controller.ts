import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrendsService } from './trend.service';

@ApiTags('trends')
@Controller('trends')
export class TrendsController {
  constructor(private trendsService: TrendsService) {}

  @Get()
  @ApiOperation({ summary: 'Get technology trends' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'quarter'] })
  @ApiQuery({ name: 'limit', required: false })
  getTrends(
    @Query('period') period?: string,
    @Query('limit') limit?: string,
  ) {
    return this.trendsService.getTrends(period, limit ? +limit : 10);
  }
}
