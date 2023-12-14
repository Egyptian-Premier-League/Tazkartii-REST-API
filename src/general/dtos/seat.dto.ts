import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SingleSeatDto {
  @ApiProperty()
  @IsNumber()
  seatRow: number;

  @ApiProperty()
  @IsNumber()
  seatNumber: number;
}
