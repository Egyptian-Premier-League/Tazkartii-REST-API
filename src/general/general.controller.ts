import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GeneralService } from './general.service';

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
}
