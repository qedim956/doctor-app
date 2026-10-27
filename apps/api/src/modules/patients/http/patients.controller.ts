import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { PatientsService } from '../application/patients.service.js';
import { ZodValidationPipe } from '../../../common/zod-validation.pipe.js';
import { type CreatePatientInput, createPatientSchema } from '@clinic/domain';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createPatientSchema)) body: CreatePatientInput,
  ) {
    return this.patients.register({
      ...body,
      birthDate: new Date(body.birthDate),
    });
  }

  @Get()
  list() {
    return this.patients.list();
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.patients.get(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.patients.delete(id);
  }
}
