import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from 'src/users/dtos/create-user.dto';
import { Stadium } from './entities/stadium.entity';
import { Repository } from 'typeorm';
import { CreateStadiumDto } from './dtos/create-stadium.dto';

@Injectable()
export class GeneralService {
  constructor(
    @InjectRepository(Stadium)
    private readonly stadiumRepository: Repository<Stadium>,
  ) {}

  getCities() {
    return JSON.stringify(Object.values(Cities));
  }

  getStadiums() {
    return this.stadiumRepository.find();
  }

  async createStadium(body: CreateStadiumDto) {
    const stadium = this.stadiumRepository.create(body);

    await this.stadiumRepository.save(stadium);

    return JSON.stringify({ message: 'Stadium Created Succesfully' });
  }
}
