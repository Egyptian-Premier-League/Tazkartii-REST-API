import { Injectable } from '@nestjs/common';
import { Cities } from 'src/users/dtos/create-user.dto';

@Injectable()
export class GeneralService {
  getCities() {
    return JSON.stringify(Object.values(Cities));
  }
}
