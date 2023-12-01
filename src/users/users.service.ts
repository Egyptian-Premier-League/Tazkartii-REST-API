import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(userData: CreateUserDto) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  findUserByUsername(username: string) {
    if (!username) return null;
    return this.userRepository.findOne({
      where: { username: ILike(username) },
    });
  }

  findUserByEmail(email: string) {
    if (!email) return null;
    return this.userRepository.findOne({ where: { email: ILike(email) } });
  }

  findUserById(id: number) {
    if (!id) return null;
    return this.userRepository.findOne({ where: { id: id } });
  }
}
