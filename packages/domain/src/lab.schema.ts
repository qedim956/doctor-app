import { z } from 'zod';
import { LAB_TYPES, LAB_UNITS } from './labs.js';

export const createLabSchema = z
  .object({
    type: z.enum(LAB_TYPES),
    value: z.number().positive('Dəyər müsbət olmalıdır'),
    unit: z.string().trim().min(1, 'Vahid boş ola bilməz'),
    takenAt: z.iso.date(),
  })
  .superRefine((data, ctx) => {
    const allowed = Object.keys(LAB_UNITS[data.type].factors);
    if (!allowed.includes(data.unit)) {
      ctx.addIssue({
        code: 'custom',
        path: ['unit'],
        message: `Bu analiz üçün vahid: ${allowed.join(', ')}`,
      });
    }
  });

export type CreateLabInput = z.infer<typeof createLabSchema>;