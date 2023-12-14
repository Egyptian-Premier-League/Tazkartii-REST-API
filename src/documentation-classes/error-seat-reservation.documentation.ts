import { ApiProperty } from '@nestjs/swagger';

export class ErrorSeatReservationDocumentation {
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
    description: 'The error message regarding this seat',
    example: 'Seat is reserved',
  })
  error: string;
}
