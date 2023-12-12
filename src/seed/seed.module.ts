import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from 'src/admins/admins.module';
import { Admin } from 'src/admins/entities/admin.entity';
import { AdminSeed } from './admin.seed';
import { Team } from 'src/general/entities/team.entity';
import { TeamSeed } from './team.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Team]), AdminsModule],
  providers: [AdminSeed, TeamSeed],
  exports: [AdminSeed, TeamSeed],
})
export class SeedModule {}
