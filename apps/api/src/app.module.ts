import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { CategoriesModule } from './categories/category.module';
import { TechnologiesModule } from './technologies/technology.module';
import { VotesModule } from './votes/vote.module';
import { TrendsModule } from './trends/trend.module';
import { RadarModule } from './radar/radar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'data/radar.db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    TechnologiesModule,
    VotesModule,
    TrendsModule,
    RadarModule,
    DashboardModule,
    SeedModule,
  ],
})
export class AppModule {}
