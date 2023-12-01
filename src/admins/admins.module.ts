import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentAdminInterceptor } from './interceptors/current-admin.interceptor';

@Module({
  controllers: [AdminsController],
  providers: [
    AdminsService,
    { provide: APP_INTERCEPTOR, useClass: CurrentAdminInterceptor },
  ],
  imports: [
    TypeOrmModule.forFeature([Admin, User]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AdminsService],
})
export class AdminsModule {}
