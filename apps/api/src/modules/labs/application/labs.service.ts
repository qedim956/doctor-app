import { Inject, Injectable } from '@nestjs/common';
import type { LabType } from '@clinic/domain';
import { PatientsService } from '../../patients/application/patients.service.js';
import { LabResult } from '../domain/lab-result.js';
import {
  LAB_RESULT_REPOSITORY,
  type LabResultRepository,
} from '../domain/lab-result.repository.js';

@Injectable()
export class LabsService {
  constructor(
    @Inject(LAB_RESULT_REPOSITORY) private readonly repo: LabResultRepository,
    private readonly patients: PatientsService,
  ) {}

  async add(
    patientId: string,
    input: { type: LabType; value: number; unit: string; takenAt: Date },
  ) {
    await this.patients.get(patientId); // yoxdursa NotFoundError → 404

    const result = LabResult.create({ ...input, patientId });
    await this.repo.save(result);
    return result;
  }

  async list(patientId: string, type?: LabType) {
    await this.patients.get(patientId);
    return this.repo.listByPatient(patientId, type);
  }
}
