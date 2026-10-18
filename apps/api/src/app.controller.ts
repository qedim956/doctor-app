import { BadRequestException, Controller, Get, ParseFloatPipe, Query } from '@nestjs/common';
import { calcBmi } from '@clinic/domain';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('bmi')
  bmi(
    @Query('weightKg', ParseFloatPipe) weightKg: number,
    @Query('heightCm', ParseFloatPipe) heightCm: number,
  ) {
    try {
      return { bmi: calcBmi(weightKg, heightCm) };
    } catch (e) {
      if (e instanceof RangeError) throw new BadRequestException(e.message);
      throw e;
    }
  }
}