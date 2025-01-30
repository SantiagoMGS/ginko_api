import { Injectable } from '@nestjs/common';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';

@Injectable()
export class CommonService {
  async getAllCountries() {
    return 'This action returns all countries';
  }

  async getAllDepartments() {
    return 'This action returns all departments';
  }

  async getAllCities() {
    return 'This action returns all cities';
  }
}
