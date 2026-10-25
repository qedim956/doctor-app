import { date, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const sexEnum = pgEnum('sex', ['male', 'female']);

export const patientsTable = pgTable('patients', {
  id: uuid('id').primaryKey(),
  fullName: varchar('full_name', { length: 200 }).notNull(),
  birthDate: date('birth_date', { mode: 'date' }).notNull(),
  sex: sexEnum('sex').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});