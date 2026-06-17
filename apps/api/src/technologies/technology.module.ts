import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './technology.entity';
import { TechnologiesService } from './technology.service';
import { TechnologiesController } from './technology.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Technology])],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
  exports: [TechnologiesService, TypeOrmModule],
})
export class TechnologiesModule {}
