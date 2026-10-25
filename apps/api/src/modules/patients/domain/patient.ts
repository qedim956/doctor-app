import { randomUUID } from 'node:crypto';
import { DomainError } from '../../../common/errors.js';
import { calcAge } from '@clinic/domain';

export type Sex = 'male' | 'female';

type PatientProps = {
  id: string;
  fullName: string;
  birthDate: Date;
  sex: Sex;
  createdAt: Date;
};

export class Patient {
  private constructor(private readonly props: PatientProps) {}

  static create(
    input: { fullName: string; birthDate: Date; sex: Sex },
    now = new Date(),
  ) {
    const fullName = input.fullName?.trim() ?? '';
    if (fullName.length < 2)
      throw new DomainError('Ad ən azı 2 simvol olmalıdır');
    if (Number.isNaN(input.birthDate.getTime()) || input.birthDate > now) {
      throw new DomainError('Doğum tarixi düzgün deyil');
    }
    if (input.sex !== 'male' && input.sex !== 'female') {
      throw new DomainError('Cins düzgün deyil');
    }
    return new Patient({
      id: randomUUID(),
      fullName,
      birthDate: input.birthDate,
      sex: input.sex,
      createdAt: now,
    });
  }

  static restore(props: PatientProps) {
    return new Patient(props);
  }

  get id() {
    return this.props.id;
  }

  toSnapshot(): PatientProps {
    return { ...this.props }; // DB-yə yazanda: yalnız saxlanan sahələr
  }

  toJSON() {
    return {
      ...this.props,
      age: calcAge(this.props.birthDate, this.props.createdAt),
    };
  }
}
