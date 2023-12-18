import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { GeneralModule } from './general/general.module';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/entities/admin.entity';
import { SeedModule } from './seed/seed.module';
import { AdminSeed } from './seed/admin.seed';
import { Stadium } from './general/entities/stadium.entity';
import { Team } from './general/entities/team.entity';
import { TeamSeed } from './seed/team.seed';
import { Seat } from './general/entities/seat.entity';
import { Match } from './general/entities/match.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? `.env.development` : '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (process.env.NODE_ENV === 'development') {
          return {
            type: 'postgres',
            ssl: process.env.NODE_ENV === 'development' ? false : true,
            host: config.getOrThrow<string>('DATABASE_HOST'),
            port: config.getOrThrow<number>('DATABASE_PORT'),
            database: config.getOrThrow<string>('DATABASE_NAME'),
            username: config.getOrThrow<string>('DATABASE_USER'),
            password: config.getOrThrow<string>('DATABASE_PASSWORD'),
            entities: [User, Admin, Stadium, Team, Match, Seat],
            logger: 'file',
            logging: true,
            synchronize: true,
          };
        }
      },
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    GeneralModule,
    AdminsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly adminSeed: AdminSeed,
    private readonly teamSeed: TeamSeed,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.adminSeed.seedAdmin();
    await this.teamSeed.seedTeams();
  }
}
