import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditMatchDto {
  @ApiProperty()
  @IsNumber()
  homeTeamId: number;

  @ApiProperty()
  @IsNumber()
  awayTeamId: number;

  @ApiProperty()
  @IsNumber()
  stadiumId: number;

  @ApiProperty()
  @IsDateString()
  matchDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mainReferee: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstLineMan: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secondLineMan: string;
}
