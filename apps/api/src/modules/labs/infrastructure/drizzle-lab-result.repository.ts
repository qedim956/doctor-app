import { Inject, Injectable } from '@nestjs/common';
import { and, eq, desc } from 'drizzle-orm';
import { type Db, DB } from '../../../db/db.module.js';
import { LabResult } from '../domain/lab-result.js';
import { LabResultRepository } from '../domain/lab-result.repository.js';
import { LabType } from '@clinic/domain';
import { labResultsTable } from './lab-results.table.js';

@Injectable()
export class DrizzleLabResultRepository implements LabResultRepository {
  constructor(@Inject(DB) private readonly db: Db) {}

  async save(result: LabResult): Promise<void> {
    await this.db.insert(labResultsTable).values(result.toSnapshot());
  }

  async listByPatient(patientId: string, type?: LabType): Promise<LabResult[]> {
    const rows = await this.db
      .select()
      .from(labResultsTable)
      .where(
        and(
          eq(labResultsTable.patientId, patientId),
          type ? eq(labResultsTable.type, type) : undefined,
        ),
      )
      .orderBy(desc(labResultsTable.takenAt), desc(labResultsTable.createdAt));
    return rows.map((row) => LabResult.restore(row));
  }
}
