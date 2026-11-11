import { Module } from '@nestjs/common';
import { LabsService } from './application/labs.service.js';
import { LabsController } from './http/labs.controller.js';
import { LAB_RESULT_REPOSITORY } from './domain/lab-result.repository.js';
import { DrizzleLabResultRepository } from './infrastructure/drizzle-lab-result.repository.js';
import { PatientsModule } from '../patients/patients.module.js';

@Module({
  imports: [PatientsModule],
  controllers: [LabsController],
  providers: [
    LabsService,
    { provide: LAB_RESULT_REPOSITORY, useClass: DrizzleLabResultRepository },
  ],
  exports: [LabsService],
})
export class LabsModule {}
