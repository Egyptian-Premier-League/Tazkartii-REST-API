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

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seatNumber: number;

  @Column()
  seatRow: number;

  @Column()
  ticketNumber: string;

  @ManyToOne(() => Match, (match) => match.seats)
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @ManyToOne(() => User, (user) => user.seats)
  @JoinColumn({ name: 'userId' })
  user: User;
}
