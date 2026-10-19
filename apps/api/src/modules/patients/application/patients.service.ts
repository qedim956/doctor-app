import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../common/errors.js';
import { Patient, Sex } from '../domain/patient.js';
import { PATIENT_REPOSITORY, type PatientRepository } from '../domain/patient.repository.js';

@Injectable()
export class PatientsService {
  constructor(@Inject(PATIENT_REPOSITORY) private readonly repo: PatientRepository) {}

  async register(input: { fullName: string; birthDate: Date; sex: Sex }) {
    const patient = Patient.create(input);
    await this.repo.save(patient);
    return patient;
  }

  async get(id: string) {
    const patient = await this.repo.findById(id);
    if (!patient) throw new NotFoundError('Xəstə tapılmadı');
    return patient;
  }

  list() {
    return this.repo.findAll();
  }
}