import { randomUUID } from 'node:crypto';
import { LAB_UNITS, LabType, toCanonical } from '@clinic/domain';
import { DomainError } from '../../../common/errors.js';

type LabResultProps = {
  id: string;
  patientId: string;
  type: LabType;
  value: number; // daxil edilən
  unit: string; // daxil edilən
  canonicalValue: number; // standart vahiddə
  takenAt: Date;
  createdAt: Date;
};

export class LabResult {
  private constructor(private readonly props: LabResultProps) {}

  static create(
    input: {
      patientId: string;
      type: LabType;
      value: number;
      unit: string;
      takenAt: Date;
    },
    now = new Date(),
  ) {
    if (Number.isNaN(input.takenAt.getTime()) || input.takenAt > now) {
      throw new DomainError('Analiz tarixi düzgün deyil');
    }

    let canonicalValue: number;
    try {
      canonicalValue = toCanonical(input.type, input.value, input.unit);
    } catch (e) {
      if (e instanceof RangeError) throw new DomainError(e.message);
      throw e;
    }
    return new LabResult({
      id: randomUUID(),
      patientId: input.patientId,
      type: input.type,
      value: input.value,
      unit: input.unit,
      canonicalValue,
      takenAt: input.takenAt,
      createdAt: now,
    });
  }

  static restore(props: LabResultProps) {
    return new LabResult(props);
  }
  toSnapshot(): LabResultProps {
    return { ...this.props };
  }
  toJSON() {
    return {
      ...this.props,
      canonicalUnit: LAB_UNITS[this.props.type].canonical,
    };
  }
}
