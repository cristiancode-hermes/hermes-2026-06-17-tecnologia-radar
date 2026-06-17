import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Technology } from '../technologies/technology.entity';
import { Vote } from '../votes/vote.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Technology, Vote])],
  providers: [SeedService],
})
export class SeedModule {}
