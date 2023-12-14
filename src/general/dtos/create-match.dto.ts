import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty()
  @IsNumber()
  homeTeamId: number;

  @ApiProperty()
  @IsNumber()
  awayTeamId: number;

  @ApiProperty()
  @IsDateString()
  matchDate: Date;

  @ApiProperty()
  @IsNumber()
  stadiumId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mainReferre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstLineMan: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secondLineMan: string;
}
