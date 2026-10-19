import { DomainError, NotFoundError } from '../../../common/errors.js';
import { InMemoryPatientRepository } from '../infrastructure/in-memory-patient.repository.js';
import { PatientsService } from './patients.service.js';

describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(() => {
    service = new PatientsService(new InMemoryPatientRepository());
  });

  it('registers and finds a patient', async () => {
    const p = await service.register({ fullName: 'Aysel Məmmədova', birthDate: new Date('1970-05-01'), sex: 'female' });
    expect((await service.get(p.id)).id).toBe(p.id);
  });

  it('rejects a birth date in the future', async () => {
    await expect(
      service.register({ fullName: 'Test', birthDate: new Date('2999-01-01'), sex: 'male' }),
    ).rejects.toThrow(DomainError);
  });

  it('throws NotFoundError for unknown id', async () => {
    await expect(service.get('00000000-0000-0000-0000-000000000000')).rejects.toThrow(NotFoundError);
  });
});