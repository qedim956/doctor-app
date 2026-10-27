import { Patient } from './patient.js';

export const PATIENT_REPOSITORY = Symbol('PATIENT_REPOSITORY');

export interface PatientRepository {
  save(patient: Patient): Promise<void>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
}