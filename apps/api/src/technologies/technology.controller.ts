import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TechnologiesService } from './technology.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@ApiTags('technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(private technologiesService: TechnologiesService) {}

  @Get()
  @ApiOperation({ summary: 'List technologies with filtering' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'period', required: false })
  @ApiQuery({ name: 'minScore', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('period') period?: string,
    @Query('minScore') minScore?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('search') search?: string,
  ) {
    return this.technologiesService.findAll({
      categoryId: categoryId ? +categoryId : undefined,
      period,
      minScore: minScore ? +minScore : undefined,
      sortBy,
      order,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get technology by id' })
  findById(@Param('id') id: string) {
    return this.technologiesService.findById(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create technology (admin)' })
  create(@Body() dto: CreateTechnologyDto) {
    return this.technologiesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update technology (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateTechnologyDto) {
    return this.technologiesService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete technology (admin)' })
  delete(@Param('id') id: string) {
    return this.technologiesService.delete(+id);
  }
}
