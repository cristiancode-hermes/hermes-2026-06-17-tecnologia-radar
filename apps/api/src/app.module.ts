import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DATABASE_TYPE', 'better-sqlite3');
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            url: config.get<string>('DATABASE_URL'),
            synchronize: true,
            autoLoadEntities: true,
            ssl: { rejectUnauthorized: false },
          };
        }
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DATABASE_URL', 'data/radar.db'),
          synchronize: true,
          autoLoadEntities: true,
        };
      },
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
