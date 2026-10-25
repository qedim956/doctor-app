import { Module } from '@nestjs/common';
import { PatientsService } from './application/patients.service.js';
import { PATIENT_REPOSITORY } from './domain/patient.repository.js';
import { PatientsController } from './http/patients.controller.js';
import { DrizzlePatientRepository } from './infrastructure/drizzle-patient.repository.js';

@Module({
  controllers: [PatientsController],
  providers: [
    PatientsService,
    { provide: PATIENT_REPOSITORY, useClass: DrizzlePatientRepository },
  ],
  exports: [PatientsService],
})
export class PatientsModule {}