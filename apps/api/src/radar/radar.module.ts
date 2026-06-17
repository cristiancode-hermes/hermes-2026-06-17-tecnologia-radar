import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/category.entity';
import { Technology } from '../technologies/technology.entity';
import { RadarService } from './radar.service';
import { RadarController } from './radar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Technology])],
  controllers: [RadarController],
  providers: [RadarService],
})
export class RadarModule {}
