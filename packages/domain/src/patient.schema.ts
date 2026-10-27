import { z } from 'zod';

const NAME_PATTERN = /^[\p{L}\s'-]+$/u;

export const createPatientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Ad ən azı 2 simvol olmalıdır')
    .max(200)
    .regex(NAME_PATTERN, 'Ad yalnız hərflərdən ibarət olmalıdır'),
  birthDate: z.iso.date(),
  sex: z.enum(['male', 'female']),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;