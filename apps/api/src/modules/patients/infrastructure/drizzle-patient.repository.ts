import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB, type Db } from '../../../db/db.module.js';
import { Patient } from '../domain/patient.js';
import type { PatientRepository } from '../domain/patient.repository.js';
import { patientsTable } from './patients.table.js';

@Injectable()
export class DrizzlePatientRepository implements PatientRepository {
  constructor(@Inject(DB) private readonly db: Db) {}

  async save(patient: Patient) {
    const row = patient.toSnapshot();
    await this.db.insert(patientsTable).values(row).onConflictDoUpdate({
        target: patientsTable.id,
        set: {
          fullName: row.fullName,
          birthDate: row.birthDate,
          sex: row.sex,
        },
    });
  }

  async findById(id: string) {
    const rows = await this.db.select().from(patientsTable).where(eq(patientsTable.id, id)).limit(1);
    return rows[0] ? Patient.restore(rows[0]) : null;
  }

  async findAll() {
    const rows = await this.db.select().from(patientsTable);
    return rows.map((row) => Patient.restore(row));
  }
}