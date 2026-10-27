import { Injectable } from '@nestjs/common';
import { Patient } from '../domain/patient.js';
import { PatientRepository } from '../domain/patient.repository.js';

@Injectable()
export class InMemoryPatientRepository implements PatientRepository {
  private readonly items = new Map<string, Patient>();

  async save(patient: Patient) {
    this.items.set(patient.id, patient);
  }

  async findById(id: string) {
    return this.items.get(id) ?? null;
  }

  async findAll() {
    return [...this.items.values()];
  }

  async delete(id: string) {
    return this.items.delete(id);
  }
}
