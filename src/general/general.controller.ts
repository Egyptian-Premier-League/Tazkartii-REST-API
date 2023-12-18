import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  ParseIntPipe,
  BadRequestException,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { ManagerAuthGuard } from 'src/guards/manager-auth.guard';
import { Stadium } from './entities/stadium.entity';
import { CreateStadiumDto } from './dtos/create-stadium.dto';
import { Team } from './entities/team.entity';
import { CreateMatchDto } from './dtos/create-match.dto';
import { ReserveSeatDto } from './dtos/reserve-seat.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { SeatReservationDocumentation } from 'src/documentation-classes/seat-reservation.documentation';
import { ErrorSeatReservationDocumentation } from 'src/documentation-classes/error-seat-reservation.documentation';
import { Match } from './entities/match.entity';
import { MatchDetailsDocumentation } from 'src/documentation-classes/match-details.documentation';
import { EditMatchDto } from './dtos/edit-match.dto';

@Controller('general')
@ApiTags('general')
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Get('cities')
  @ApiOkResponse({
    description: 'Cities',
    type: String,
    isArray: true,
  })
  @ApiOperation({ summary: 'Used to get the available cities' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getCities() {
    return this.generalService.getCities();
  }

  @Get('stadiums')
  @UseGuards(ManagerAuthGuard)
  @ApiBearerAuth('JWT-auth-manager')
  @ApiOkResponse({
    description: 'Stadiums',
    type: Stadium,
    isArray: true,
  })
  @ApiOperation({ summary: 'Used to get the stadiums' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getStadiums() {
    return this.generalService.getStadiums();
  }

  @Get('teams')
  @UseGuards(ManagerAuthGuard)
  @ApiBearerAuth('JWT-auth-manager')
  @ApiOkResponse({
    description: 'Teams',
    type: Team,
    isArray: true,
  })
  @ApiOperation({ summary: 'Used to get the teams' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getTeams() {
    return this.generalService.getTeams();
  }

  @Post('stadium')
  @UseGuards(ManagerAuthGuard)
  @ApiBearerAuth('JWT-auth-manager')
  @ApiOperation({ summary: 'Used to create a stadium' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Stadium Created Succesfully',
        },
      },
    },
  })
  createStadium(@Body() body: CreateStadiumDto) {
    return this.generalService.createStadium(body);
  }

  @Post('create-match')
  @UseGuards(ManagerAuthGuard)
  @ApiOperation({ summary: 'Used to create a match' })
  @ApiBearerAuth('JWT-auth-manager')
  @ApiCreatedResponse({
    description: 'Match Created Succesfully',
    schema: {
      type: 'object',
      properties: {
        matchId: {
          type: 'number',
          example: 3,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createMatch(@Body() body: CreateMatchDto) {
    return this.generalService.createMatch(body);
  }

  @Put('edit-match/:matchId')
  @UseGuards(ManagerAuthGuard)
  @ApiOperation({ summary: 'Used to edit a match' })
  @ApiParam({
    name: 'matchId',
    required: true,
    description: 'the match id',
    type: 'number',
  })
  @ApiCreatedResponse({
    description: 'Match updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Match updated successfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Match not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnprocessableEntityResponse({
    description:
      'Can not change the stadium as it is smaller than the current one and there is users who booked in the larger seats',
  })
  @ApiBearerAuth('JWT-auth-manager')
  editMatch(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() body: EditMatchDto,
  ) {
    return this.generalService.editMatch(matchId, body);
  }

  @Post('reserve-seat')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Used to reserve seats' })
  @ApiCreatedResponse({
    type: SeatReservationDocumentation,
    isArray: true,
  })
  @ApiOkResponse({
    type: ErrorSeatReservationDocumentation,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiNotFoundResponse({ description: 'Match not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  reserveSeat(@Body() body: ReserveSeatDto, @CurrentUser() user: User) {
    return this.generalService.reserveSeat(user, body);
  }

  @Get('matches')
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'the number of the page (must be positive >=1)',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Array of matches',
    isArray: true,
    type: Match,
  })
  @ApiOperation({ summary: 'Used to get the matches' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getMatches(@Query('page', ParseIntPipe) page: number) {
    if (page < 1)
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    return this.generalService.getMatches(page);
  }

  @Get('match-details/:matchId')
  @ApiParam({
    name: 'matchId',
    required: true,
    description: 'the match id',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Match Details',
    type: MatchDetailsDocumentation,
  })
  @ApiOperation({ summary: 'Used to get the match details' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getMatcheDetails(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.generalService.getMatchDetails(matchId);
  }
}
