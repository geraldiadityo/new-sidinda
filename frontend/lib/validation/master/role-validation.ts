import { z } from 'zod';

export const roleSchema = z.object({
    nama: z.string().min(1, 'Min 3 Character').max(100, 'Max 100 character'),
});

export const roleEditSchema = roleSchema.extend({
    id: z.number().min(1, 'Required ID')
});

export type RoleFormValues = z.infer<typeof roleSchema>;
export type RoleEditValues = z.infer<typeof roleEditSchema>;