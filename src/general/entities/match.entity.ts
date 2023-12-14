// match.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Stadium } from './stadium.entity';
import { Seat } from './seat.entity';
import { Team } from './team.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  mainReferee: string;

  @Column()
  firstLineMan: string;

  @Column()
  secondLineMan: string;

  @ManyToOne(() => Stadium, (stadium) => stadium.matches)
  stadium: Stadium;

  @ManyToOne(() => Team, (team) => team.homeMatches)
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.awayMatches)
  awayTeam: Team;

  @OneToMany(() => Seat, (seat) => seat.match)
  seats: Seat[];
}
