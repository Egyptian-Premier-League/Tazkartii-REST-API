import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { AdminsService } from 'src/admins/admins.service';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private adminService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async signup(userData: CreateUserDto) {
    if (userData.password !== userData.confirmPassword)
      throw new BadRequestException("Passwords didn't match");

    let user = await this.userService.findUserByUsername(userData.username);
    let admin = await this.adminService.findAdminByUsername(userData.username);

    if (user || admin) throw new BadRequestException('Username is in use');

    user = await this.userService.findUserByEmail(userData.email);
    admin = await this.adminService.findAdminByEmail(userData.email);

    if (user || admin) throw new BadRequestException('Email is in use');

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

    userData.password = resultPassword;
    const createdUser = await this.userService.createUser(userData);

    const payload = {
      userId: createdUser.id,
      username: createdUser.username,
      role: createdUser.role,
      approved: createdUser.approved,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      accessToken: token,
      role: createdUser.role,
      approved: createdUser.approved,
    };
  }
}
