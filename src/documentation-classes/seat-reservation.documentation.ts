import { ApiProperty } from '@nestjs/swagger';

export class SeatReservationDocumentation {
  @ApiProperty({
    description: 'The id of the seat',
    example: 5,
  })
  seatId: number;

  @ApiProperty({
    description: 'The unique ticket number of this seat',
    example: '6b70dd68-657b-48ba-bfab-133085dfc0f9',
  })
  ticketNumber: number;

  @ApiProperty({
    description: 'The seat number',
    example: 1,
  })
  seatNumber: number;

  @ApiProperty({
    description: 'The seat row',
    example: 3,
  })
  seatRow: number;

  @ApiProperty({
    description: 'The id of the match',
    example: 8,
  })
  matchId: number;
}
