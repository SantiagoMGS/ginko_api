import { Injectable } from '@nestjs/common';

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
