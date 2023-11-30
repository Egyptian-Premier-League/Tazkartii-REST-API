import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { User } from 'src/users/entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrypt);

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  createAdmin(adminData: CreateAdminDto) {
    const admin = this.adminRepository.create(adminData);
    return this.adminRepository.save(admin);
  }

  findAdminByUsername(username: string) {
    if (!username) return null;
    return this.adminRepository.findOne({ where: { username: username } });
  }

  findAdminByEmail(email: string) {
    if (!email) return null;
    return this.adminRepository.findOne({ where: { email: email } });
  }

  findUserByUsername(username: string) {
    if (!username) return null;
    return this.userRepository.findOne({ where: { username: username } });
  }

  findUserByEmail(email: string) {
    if (!email) return null;
    return this.userRepository.findOne({ where: { email: email } });
  }

  async signup(adminData: CreateAdminDto) {
    let admin = await this.findAdminByEmail(adminData.email);
    let user = await this.findUserByEmail(adminData.email);
    if (admin || user) throw new BadRequestException('Email is in use');

    admin = await this.findAdminByUsername(adminData.username);
    user = await this.findUserByUsername(adminData.username);

    if (admin || user) throw new BadRequestException('Username is in use');

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password
    const hashedPassword = (await scrypt(
      adminData.password,
      salt,
      32,
    )) as Buffer;

    // Join the hashed result and the salt together
    const resultPassword = salt + '.' + hashedPassword.toString('hex');

    adminData.password = resultPassword;
    const createdUser = await this.createAdmin(adminData);

    const payload = {
      userId: createdUser.id,
      username: createdUser.username,
      role: 'Admin',
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      accessToken: token,
      role: 'Admin',
    };
  }

  async signin(username: string, password: string) {
    const admin = await this.findAdminByUsername(username);
    if (!admin) throw new NotFoundException('Admin not found');

    const [salt, storedHash] = admin.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Wrong username and password');

    const payload = {
      userId: admin.id,
      username: admin.username,
      role: 'Admin',
    };
    console.log('Returning Admin token');
    const token = await this.jwtService.signAsync(payload);
    return {
      accessToken: token,
      role: 'Admin',
      approved: true,
    };
  }
}
