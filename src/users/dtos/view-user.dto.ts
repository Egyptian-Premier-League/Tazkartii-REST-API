import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ViewUserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  city: string;

  @Expose()
  @ApiProperty()
  gender: string;

  @Expose()
  @ApiProperty()
  role: string;

  @Expose()
  @ApiProperty()
  birthdate: Date;

  @Expose()
  @ApiProperty()
  address: string;

  @Expose()
  @ApiProperty()
  approved: boolean;
}
