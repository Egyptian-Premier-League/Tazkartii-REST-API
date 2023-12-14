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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'timestamptz' })
  @ApiProperty()
  date: Date;

  @Column()
  @ApiProperty()
  mainReferee: string;

  @Column()
  @ApiProperty()
  firstLineMan: string;

  @Column()
  @ApiProperty()
  secondLineMan: string;

  @ManyToOne(() => Stadium, (stadium) => stadium.matches)
  @ApiProperty({ type: Stadium })
  stadium: Stadium;

  @ManyToOne(() => Team, (team) => team.homeMatches)
  @ApiProperty({ type: Team })
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.awayMatches)
  @ApiProperty({ type: Team })
  awayTeam: Team;

  @OneToMany(() => Seat, (seat) => seat.match)
  seats: Seat[];
}
