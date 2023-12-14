import { ApiProperty } from '@nestjs/swagger';

export class SeatDocumentation {
  @ApiProperty()
  id: number;

  @ApiProperty()
  seatNumber: number;

  @ApiProperty()
  seatRow: number;

  @ApiProperty()
  ticketNumber: string;
}
