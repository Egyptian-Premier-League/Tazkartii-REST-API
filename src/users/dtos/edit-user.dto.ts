import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Cities, Genders } from './create-user.dto';

export class EditUserDto {
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

  @ApiProperty({ example: '2023-10-23' })
  @IsISO8601()
  birthdate: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;
}
