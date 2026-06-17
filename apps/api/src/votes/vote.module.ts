import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VotesService } from './vote.service';
import { VotesController } from './vote.controller';
import { TechnologiesModule } from '../technologies/technology.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), TechnologiesModule],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService, TypeOrmModule],
})
export class VotesModule {}
