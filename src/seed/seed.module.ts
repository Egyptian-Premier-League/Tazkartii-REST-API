import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from 'src/admins/admins.module';
import { Admin } from 'src/admins/entities/admin.entity';
import { AdminSeed } from './admin.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), AdminsModule],
  providers: [AdminSeed],
  exports: [AdminSeed],
})
export class SeedModule {}
