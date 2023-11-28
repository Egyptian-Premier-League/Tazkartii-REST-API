import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/users/dtos/create-user.dto';

export class Token {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiemV5MiIsInJvbGUiOiJNYW5hZ2VyIiwiYXBwcm92ZWQiOmZhbHNlLCJpYXQiOjE3MDEyMDg4ODAsImV4cCI6MTcwMTgxMzY4MH0.JT_K3zwtFi6F_0f1Yx0CHIkSbk5ozQ9TLTBudEA2yzc',
  })
  accessToken: string;

  @ApiProperty({ enum: Roles })
  role: string;

  @ApiProperty({
    description: 'To determine whether the user is approved or not',
  })
  approved: boolean;
}
