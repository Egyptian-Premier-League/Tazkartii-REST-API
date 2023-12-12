import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Team } from 'src/general/entities/team.entity';
import * as teamsDataJson from './teams.json';

@Injectable()
export class TeamSeed {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private configService: ConfigService,
  ) {}

  async seedTeams() {
    const teamExist = (await this.teamRepository.count()) > 0;
    if (!teamExist) {
      const teamsData = teamsDataJson;
      const teams = [];
      for (const team of teamsData) {
        const teamDb = this.teamRepository.create({
          name: team.name,
          photoUrl: team.photo,
        });
        teams.push(teamDb);
      }
      await this.teamRepository.save(teams);
    }
  }
}
