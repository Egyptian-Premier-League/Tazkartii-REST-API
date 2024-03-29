import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as moment from 'moment';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { EditUserPasswordDto } from './dtos/edit-user-password.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Seat } from 'src/general/entities/seat.entity';
const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
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

  async editUserPassword(userId: number, userData: EditUserPasswordDto) {
    if (!userId) throw new NotFoundException('User not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (userData.password !== userData.confirmPassword)
      throw new BadRequestException("password doesn't match");

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password
    const hashedPassword = (await scrypt(
      userData.password,
      salt,
      32,
    )) as Buffer;

    // Join the hashed result and the salt together
    const resultPassword = salt + '.' + hashedPassword.toString('hex');

    user.password = resultPassword;
    await this.userRepository.save(user);

    return { message: 'Password Changed Succesfully' };
  }

  async getMyReservations(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'seats',
        'seats.match',
        'seats.match.stadium',
        'seats.match.homeTeam',
        'seats.match.awayTeam',
      ],
    });
    if (!user) throw new NotFoundException('User not found');
    return user.seats;
  }

  async cancelReservation(seatId: number, userId: number) {
    const seat = await this.seatRepository.findOne({
      where: { id: seatId },
      relations: ['match', 'user'],
    });
    if (!seat) throw new NotFoundException('Seat not found');
    if (seat.user.id !== userId)
      throw new UnauthorizedException('Not authorized to do this');

    const today = moment();

    const matchDate = moment(moment(seat.match.date).format('YYYY-MM-DD'));

    const threeDaysBeforeMatch = moment(
      matchDate.subtract(3, 'days').format('YYYY-MM-DD'),
    );

    if (!today.isSameOrBefore(threeDaysBeforeMatch))
      throw new UnprocessableEntityException(
        "You can't cancel the match ticket (less than 3 days)",
      );

    await this.seatRepository.remove(seat);
    return { message: 'Reservation Canceled successfully' };
  }
}
