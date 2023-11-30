// year.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/admins/entities/admin.entity';
import { AdminsService } from 'src/admins/admins.service';
import { CreateAdminDto } from 'src/admins/dtos/create-admin.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminSeed {
  constructor(
    private readonly adminService: AdminsService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private configService: ConfigService,
  ) {}

  async seedAdmin() {
    const adminExist = (await this.adminRepository.count()) > 0;
    if (!adminExist) {
      const adminObject: CreateAdminDto = {
        email: 'zeyad.ta01@gmail.com',
        username: 'ZeyadTarekk',
        password: '12345678',
        confirmPassword: '12345678',
        firstName: 'Zeyad',
        lastName: 'Tarek',
      };
      this.adminService.signup(adminObject);
    }
  }
}
