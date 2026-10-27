import { Inject, Injectable } from '@nestjs/common';
import { eq, isNull, and } from 'drizzle-orm';
import { DB, type Db } from '../../../db/db.module.js';
import { Patient } from '../domain/patient.js';
import type { PatientRepository } from '../domain/patient.repository.js';
import { patientsTable } from './patients.table.js';

@Injectable()
export class DrizzlePatientRepository implements PatientRepository {
  constructor(@Inject(DB) private readonly db: Db) {}

  async save(patient: Patient) {
    const row = patient.toSnapshot();
    await this.db
      .insert(patientsTable)
      .values(row)
      .onConflictDoUpdate({
        target: patientsTable.id,
        set: {
          fullName: row.fullName,
          birthDate: row.birthDate,
          sex: row.sex,
        },
      });
  }

  async findById(id: string) {
    const rows = await this.db
      .select()
      .from(patientsTable)
      .where(and(eq(patientsTable.id, id), isNull(patientsTable.deletedAt)))
      .limit(1);
    return rows[0] ? Patient.restore(rows[0]) : null;
  }

  async findAll() {
    const rows = await this.db
      .select()
      .from(patientsTable)
      .where(isNull(patientsTable.deletedAt));
    return rows.map((row) => Patient.restore(row));
  }

  async delete(id: string) {
    const rows = await this.db
      .update(patientsTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(patientsTable.id, id), isNull(patientsTable.deletedAt)))
      .returning({ id: patientsTable.id });
      return rows.length > 0;
  }
}
