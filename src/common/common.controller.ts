import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('country')
  async getAllCountries() {
    return await this.commonService.getAllCountries();
  }

  @Get('department')
  async getAllDepartments() {
    return await this.commonService.getAllDepartments();
  }

  @Get('city')
  async getAllCities() {
    return await this.commonService.getAllCities();
  }
}
