import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { User } from 'src/users/entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrypt);

export enum RolesOption {
  Manager = 'Manager',
  Fan = 'Fan',
  All = 'All',
}

export enum ApprovedOption {
  true = 'true',
  false = 'false',
  All = 'All',
}
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
    return this.adminRepository.findOne({
      where: { username: ILike(username) },
    });
  }

  findAdminByEmail(email: string) {
    if (!email) return null;
    return this.adminRepository.findOne({ where: { email: ILike(email) } });
  }

  findAdminById(id: number) {
    if (!id) return null;
    return this.adminRepository.findOne({ where: { id: id } });
  }

  findUserByUsername(username: string) {
    if (!username) return null;
    return this.userRepository.findOne({
      where: { username: ILike(username) },
    });
  }

  findUserById(id: number) {
    if (!id) return null;
    return this.userRepository.findOne({ where: { id: id } });
  }

  findUserByEmail(email: string) {
    if (!email) return null;
    return this.userRepository.findOne({ where: { email: ILike(email) } });
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

  async approveUser(userId: number) {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.approved)
      throw new BadRequestException('User is already approved');

    user.approved = true;

    await this.userRepository.save(user);

    return { message: 'User Approved Succesfully' };
  }

  async getUsers(page: number, role: string, approved: string) {
    const MAX_NUMBER_PER_PAGE = 10;
    const skip = (page - 1) * MAX_NUMBER_PER_PAGE;
    const findOption = {
      skip: skip,
      take: MAX_NUMBER_PER_PAGE,
      where: {},
    };
    if (role !== RolesOption.All)
      findOption.where = { ...findOption.where, role: role };

    if (approved === ApprovedOption.true)
      findOption.where = { ...findOption.where, approved: true };
    else if (approved === ApprovedOption.false)
      findOption.where = { ...findOption.where, approved: false };

    return this.userRepository.find(findOption);
  }
}
