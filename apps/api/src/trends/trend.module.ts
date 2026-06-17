import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '../votes/vote.entity';
import { Technology } from '../technologies/technology.entity';
import { TrendsService } from './trend.service';
import { TrendsController } from './trend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Technology])],
  controllers: [TrendsController],
  providers: [TrendsService],
})
export class TrendsModule {}
