// seat.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  seatNumber: number;

  @Column()
  @ApiProperty()
  seatRow: number;

  @Column()
  @ApiProperty()
  ticketNumber: string;

  @ManyToOne(() => Match, (match) => match.seats)
  @ApiProperty({ type: Match })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @ManyToOne(() => User, (user) => user.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
