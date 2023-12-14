import { ApiProperty } from '@nestjs/swagger';
import { Stadium } from 'src/general/entities/stadium.entity';
import { Team } from 'src/general/entities/team.entity';
import { SeatDocumentation } from './seat-documentation';

export class MatchDetailsDocumentation {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  mainReferee: string;

  @ApiProperty()
  firstLineMan: string;

  @ApiProperty()
  secondLineMan: string;

  @ApiProperty({ type: Stadium })
  stadium: Stadium;

  @ApiProperty({ type: Team })
  homeTeam: Team;

  @ApiProperty({ type: Team })
  awayTeam: Team;

  @ApiProperty({ type: SeatDocumentation, isArray: true })
  seats: SeatDocumentation[];
}
