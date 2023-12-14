import { ArrayMinSize, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SingleSeatDto } from './seat.dto';
import { Type } from 'class-transformer';

export class ReserveSeatDto {
  @ApiProperty()
  @IsNumber()
  matchId: number;

  @ValidateNested({ each: true })
  @ApiProperty({ type: SingleSeatDto, isArray: true })
  @Type(() => SingleSeatDto)
  @ArrayMinSize(1)
  seats: SingleSeatDto[];
}
