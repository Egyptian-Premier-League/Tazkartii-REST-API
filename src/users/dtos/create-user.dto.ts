import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsAlphanumeric,
  IsOptional,
  IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Cities {
  Alexandria = 'Alexandria (الإسكندرية)',
  Aswan = 'Aswan (أسوان)',
  Asyut = 'Asyut (أسيوط)',
  Beheira = 'Beheira (البحيرة)',
  BeniSuef = 'Beni Suef (بني سويف)',
  Cairo = 'Cairo (القاهرة)',
  Dakahlia = 'Dakahlia (الدقهلية)',
  Damietta = 'Damietta (دمياط)',
  Faiyum = 'Faiyum (الفيوم)',
  Gharbia = 'Gharbia (الغربية)',
  Giza = 'Giza (الجيزة)',
  Ismailia = 'Ismailia (الإسماعيلية)',
  KafrElSheikh = 'Kafr El Sheikh (كفر الشيخ)',
  Luxor = 'Luxor (الأقصر)',
  Matrouh = 'Matrouh (مطروح)',
  Minya = 'Minya (المنيا)',
  Monufia = 'Monufia (المنوفية)',
  NewValley = 'New Valley (الوادي الجديد)',
  NorthSinai = 'North Sinai (شمال سيناء)',
  PortSaid = 'Port Said (بورسعيد)',
  Qalyubia = 'Qalyubia (القليوبية)',
  Qena = 'Qena (قنا)',
  RedSea = 'Red Sea (البحر الأحمر)',
  Sharqia = 'Sharqia (الشرقية)',
  Sohag = 'Sohag (سوهاج)',
  SouthSinai = 'South Sinai (جنوب سيناء)',
  Suez = 'Suez (السويس)',
}

export enum Genders {
  Male = 'Male',
  Female = 'Female',
}

export enum Roles {
  Manager = 'Manager',
  Fan = 'Fan',
}

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  confirmPassword: string;

  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ enum: Cities })
  @IsString()
  @IsEnum(Cities)
  city: string;

  @ApiProperty({ enum: Genders })
  @IsString()
  @IsEnum(Genders)
  gender: string;

  @ApiProperty({ enum: Roles })
  @IsString()
  @IsEnum(Roles)
  role: string;

  @ApiProperty({ example: '2023-10-23' })
  @IsISO8601()
  birthdate: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;
}
