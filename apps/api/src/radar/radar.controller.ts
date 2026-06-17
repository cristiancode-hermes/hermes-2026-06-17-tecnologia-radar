import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RadarService } from './radar.service';

@ApiTags('radar')
@Controller('radar')
export class RadarController {
  constructor(private radarService: RadarService) {}

  @Get()
  @ApiOperation({ summary: 'Get aggregated radar data grouped by category' })
  getRadarData() {
    return this.radarService.getRadarData();
  }
}
