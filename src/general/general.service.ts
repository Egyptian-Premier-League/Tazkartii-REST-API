import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cities } from 'src/users/dtos/create-user.dto';
import { Stadium } from './entities/stadium.entity';
import { Repository, MoreThan, MoreThanOrEqual, Between } from 'typeorm';
import { CreateStadiumDto } from './dtos/create-stadium.dto';
import { Team } from './entities/team.entity';
import { Seat } from './entities/seat.entity';
import { Match } from './entities/match.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/entities/user.entity';
import { CreateMatchDto } from './dtos/create-match.dto';
import * as moment from 'moment';
import { ReserveSeatDto } from './dtos/reserve-seat.dto';
import { EditMatchDto } from './dtos/edit-match.dto';

@Injectable()
export class GeneralService {
  constructor(
    @InjectRepository(Stadium)
    private readonly stadiumRepository: Repository<Stadium>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  getCities() {
    return JSON.stringify(Object.values(Cities));
  }

  getStadiums() {
    return this.stadiumRepository.find();
  }

  async createStadium(body: CreateStadiumDto) {
    const stadium = this.stadiumRepository.create(body);

    await this.stadiumRepository.save(stadium);

    return JSON.stringify({ message: 'Stadium Created Succesfully' });
  }

  getTeams() {
    return this.teamRepository.find();
  }

  async createMatch(matchData: CreateMatchDto) {
    if (matchData.homeTeamId === matchData.awayTeamId)
      throw new BadRequestException(
        'Home team and away team must be different',
      );

    const homeTeam = await this.teamRepository.findOne({
      where: { id: matchData.homeTeamId },
    });
    const awayTeam = await this.teamRepository.findOne({
      where: { id: matchData.awayTeamId },
    });

    if (!homeTeam || !awayTeam)
      throw new BadRequestException('Invalid teams ids');

    const stadium = await this.stadiumRepository.findOne({
      where: { id: matchData.stadiumId },
    });

    if (!stadium) throw new BadRequestException('Invalid stadium id');

    const threeDaysAfterMatchDate = moment(
      moment(matchData.matchDate).startOf('day').format('YYYY-MM-DD'),
    ).add(3, 'day');
    const threeDaysBeforeMatchDate = moment(matchData.matchDate).subtract(
      3,
      'days',
    );
    const matches = await this.matchRepository.find({
      where: [
        {
          homeTeam: { id: homeTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
        {
          awayTeam: { id: homeTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
        {
          homeTeam: { id: awayTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
        {
          awayTeam: { id: awayTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
      ],
    });
    if (matches.length > 0)
      throw new BadRequestException('One of the teams is busy');
    const matchDate = moment(matchData.matchDate);
    const matchesWithSameStadium = await this.matchRepository
      .createQueryBuilder('match')
      .where('match.stadiumId = :stadiumId', { stadiumId: stadium.id })
      .andWhere('CAST(match.date AS DATE) = CAST(:matchDate AS DATE)', {
        matchDate: matchDate.format('YYYY-MM-DD'),
      })
      .getMany();
    if (matchesWithSameStadium.length > 0)
      throw new BadRequestException('Stadium has another match in same day');

    const createdMatch = this.matchRepository.create({
      date: matchData.matchDate,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      stadium: stadium,
      mainReferee: matchData.mainReferee,
      firstLineMan: matchData.firstLineMan,
      secondLineMan: matchData.secondLineMan,
    });

    const savedMatch = await this.matchRepository.save(createdMatch);

    return { matchId: savedMatch.id };
  }

  async editMatch(matchId: number, matchData: EditMatchDto) {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['stadium'],
    });

    if (!match) throw new NotFoundException('Match not found');

    const stadium = await this.stadiumRepository.findOne({
      where: { id: matchData.stadiumId },
    });

    if (!stadium) throw new BadRequestException('Invalid stadium');

    if (matchData.homeTeamId === matchData.awayTeamId)
      throw new BadRequestException(
        'Home team and away team must be different',
      );

    const homeTeam = await this.teamRepository.findOne({
      where: { id: matchData.homeTeamId },
    });
    const awayTeam = await this.teamRepository.findOne({
      where: { id: matchData.awayTeamId },
    });

    const threeDaysAfterMatchDate = moment(
      moment(matchData.matchDate).startOf('day').format('YYYY-MM-DD'),
    ).add(3, 'day');
    const threeDaysBeforeMatchDate = moment(matchData.matchDate).subtract(
      3,
      'days',
    );
    console.log(threeDaysAfterMatchDate);
    console.log(threeDaysBeforeMatchDate);
    const matches = await this.matchRepository.find({
      where: [
        {
          homeTeam: { id: homeTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
        {
          awayTeam: { id: homeTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
        {
          homeTeam: { id: awayTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
        {
          awayTeam: { id: awayTeam.id },
          date: Between(
            new Date(threeDaysBeforeMatchDate.format('YYYY-MM-DD')),
            new Date(threeDaysAfterMatchDate.format('YYYY-MM-DD')),
          ),
        },
      ],
    });
    console.log(matches);
    if (matches.length > 0)
      throw new BadRequestException('One of the teams is busy');
    const matchDate = moment(matchData.matchDate);
    const matchesWithSameStadium = await this.matchRepository
      .createQueryBuilder('match')
      .where('match.stadiumId = :stadiumId', { stadiumId: stadium.id })
      .andWhere('CAST(match.date AS DATE) = CAST(:matchDate AS DATE)', {
        matchDate: matchDate.format('YYYY-MM-DD'),
      })
      .getMany();
    if (matchesWithSameStadium.length > 0)
      throw new BadRequestException('Stadium has another match in same day');

    if (stadium.id !== match.stadium.id) {
      const seats = await this.seatRepository.find({
        where: [
          { seatRow: MoreThan(stadium.rowsNumber), match: { id: match.id } },
          {
            seatNumber: MoreThan(stadium.seatsNumber),
            match: { id: match.id },
          },
        ],
      });
      if (seats.length > 0) {
        throw new UnprocessableEntityException(
          'Can not change the stadium as it is smaller than the current one and there is users who booked in the larger seats',
        );
      }
    }

    if (!homeTeam || !awayTeam)
      throw new BadRequestException('Invalid teams ids');

    match.awayTeam = awayTeam;
    match.homeTeam = homeTeam;
    match.date = matchData.matchDate;
    match.firstLineMan = matchData.firstLineMan;
    match.secondLineMan = matchData.secondLineMan;
    match.mainReferee = matchData.mainReferee;
    match.stadium = stadium;

    await this.matchRepository.save(match);

    return { message: 'Match updated successfully' };
  }

  async reserveSeat(user: User, seatData: ReserveSeatDto) {
    const { matchId, seats } = seatData;

    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['stadium'],
    });

    if (!match) throw new NotFoundException('Match not found');

    const finalReservationStatus = [];

    for (const seatObject of seats) {
      const seatNumber = seatObject.seatNumber;
      const seatRow = seatObject.seatRow;

      const seat = await this.seatRepository.findOne({
        where: {
          seatNumber: seatNumber,
          seatRow: seatRow,
          match: { id: matchId },
        },
      });

      if (seat) {
        finalReservationStatus.push({
          seatNumber,
          seatRow,
          error: 'Seat is reserved',
        });
        continue;
      }

      if (
        seatNumber > match.stadium.seatsNumber ||
        seatRow > match.stadium.rowsNumber
      ) {
        finalReservationStatus.push({
          seatNumber,
          seatRow,
          error: 'Invalid seat',
        });
        continue;
      }

      const ticketNumber = uuidv4();
      const reservedSeat = this.seatRepository.create({
        seatNumber: seatNumber,
        seatRow: seatRow,
        ticketNumber: ticketNumber,
        match: match,
        user: user,
      });

      const savedSeat = await this.seatRepository.save(reservedSeat);

      finalReservationStatus.push({
        seatId: savedSeat.id,
        ticketNumber: savedSeat.ticketNumber,
        seatNumber: savedSeat.seatNumber,
        seatRow: savedSeat.seatRow,
        matchId: match.id,
      });
    }
    return finalReservationStatus;
  }

  async getMatches(page: number) {
    const MAX_NUMBER_PER_PAGE = 10;
    const currentDate = new Date();
    const matches = await this.matchRepository.find({
      skip: (page - 1) * MAX_NUMBER_PER_PAGE,
      take: MAX_NUMBER_PER_PAGE,
      order: { date: 'ASC', id: 'ASC' },
      relations: ['stadium', 'homeTeam', 'awayTeam'],
      where: {
        date: MoreThanOrEqual(currentDate),
      },
    });
    return matches;
  }

  async getMatchesWithoutPagination() {
    const currentDate = new Date();
    const matches = await this.matchRepository.find({
      order: { date: 'ASC', id: 'ASC' },
      relations: ['stadium', 'homeTeam', 'awayTeam'],
      where: {
        date: MoreThanOrEqual(currentDate),
      },
    });
    return matches;
  }

  async getMatchDetails(matchId: number) {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
      relations: ['seats', 'stadium', 'homeTeam', 'awayTeam'],
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }
}
