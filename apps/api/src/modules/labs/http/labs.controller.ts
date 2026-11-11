import { z } from 'zod';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LabsService } from '../application/labs.service.js';
import { ZodValidationPipe } from '../../../common/zod-validation.pipe.js';
import {
  type CreateLabInput,
  createLabSchema,
  LAB_TYPES,
  type LabType,
} from '@clinic/domain';

const labTypeQuerySchema = z.enum(LAB_TYPES).optional();

@Controller('patients/:patientId/labs')
export class LabsController {
  constructor(private readonly labs: LabsService) {}

  @Post()
  create(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Body(new ZodValidationPipe(createLabSchema)) body: CreateLabInput,
  ) {
    return this.labs.add(patientId, {
      ...body,
      takenAt: new Date(body.takenAt),
    });
  }

  @Get()
  list(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('type', new ZodValidationPipe(labTypeQuerySchema)) type?: LabType,
  ) {
    return this.labs.list(patientId, type);
  }
}
