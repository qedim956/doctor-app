import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PatientsService } from '../application/patients.service.js';
import type { Sex } from '../domain/patient.js';

type CreatePatientBody = { fullName: string; birthDate: string; sex: Sex };

@Controller('patients')
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Post()
  create(@Body() body: CreatePatientBody) {
    return this.patients.register({ ...body, birthDate: new Date(body.birthDate) });
  }

  @Get()
  list() {
    return this.patients.list();
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.patients.get(id);
  }
}