import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';

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

  async getUserData(userId: number) {
    if (!userId) throw new NotFoundException('User not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async editUserData(userId: number, userData: EditUserDto) {
    if (!userId) throw new NotFoundException('User not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!userData.address) user.address = null;
    else user.address = userData.address;
    user.birthdate = userData.birthdate;
    user.city = userData.city;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.gender = userData.gender;
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
