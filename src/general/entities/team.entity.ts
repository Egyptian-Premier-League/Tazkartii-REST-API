import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Match } from './match.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  photoUrl: string;

  @OneToMany(() => Match, (match) => match.homeTeam)
  homeMatches: Match[];

  @OneToMany(() => Match, (match) => match.awayTeam)
  awayMatches: Match[];
}
