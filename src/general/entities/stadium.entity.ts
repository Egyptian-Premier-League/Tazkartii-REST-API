import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Match } from './match.entity';

@Entity()
export class Stadium {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  rowsNumber: number;

  @Column()
  @ApiProperty()
  seatsNumber: number;

  @OneToMany(() => Match, (match) => match.stadium)
  matches: Match[];
}
