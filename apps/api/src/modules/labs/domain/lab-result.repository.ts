import { LabType } from "@clinic/domain";
import { LabResult } from "./lab-result.js";

export const LAB_RESULT_REPOSITORY = Symbol('LAB_RESULT_REPOSITORY');

export interface LabResultRepository {
  save(result: LabResult): Promise<void>;
  listByPatient(patientId: string, type?: LabType): Promise<LabResult[]>;
}