import { date, index, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { LAB_TYPES } from '@clinic/domain';
import { patientsTable } from '../../patients/infrastructure/patients.table.js';

export const labTypeEnum = pgEnum('lab_type', LAB_TYPES);

export const labResultsTable = pgTable(
  'lab_results',
  {
    id: uuid('id').primaryKey(),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patientsTable.id),
    type: labTypeEnum('type').notNull(),
    value: numeric('value', { precision: 10, scale: 4, mode: 'number' }).notNull(),
    unit: varchar('unit', { length: 20 }).notNull(),
    canonicalValue: numeric('canonical_value', { precision: 12, scale: 4, mode: 'number' }).notNull(),
    takenAt: date('taken_at', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('lab_results_patient_type_taken_idx').on(t.patientId, t.type, t.takenAt)],
);