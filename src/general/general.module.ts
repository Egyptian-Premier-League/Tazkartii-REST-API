import { Module } from '@nestjs/common';
import { GeneralController } from './general.controller';
import { GeneralService } from './general.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stadium } from './entities/stadium.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Team } from './entities/team.entity';
import { Seat } from './entities/seat.entity';
import { Match } from './entities/match.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [GeneralController],
  providers: [GeneralService],
  imports: [
    TypeOrmModule.forFeature([Stadium, Team, Seat, Match, User]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class GeneralModule {}
