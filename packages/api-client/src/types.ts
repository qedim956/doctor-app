import { LabType } from "@clinic/domain";

export type Patient = {
  id: string;
  fullName: string;
  birthDate: string;
  sex: 'male' | 'female';
  age: number;
};

export type LabResult = {
  id: string;
  patientId: string;
  type: LabType;
  value: number;
  unit: string;
  canonicalValue: number;
  canonicalUnit: string;
  takenAt: string;
  createdAt: string;
};