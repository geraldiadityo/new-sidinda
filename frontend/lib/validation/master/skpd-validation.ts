import { z } from "zod";

export const skpdSchema = z.object({
    nama: z.string().min(5, 'Minimal 5 character').max(100, 'max 100 character')
});

export const skpdEditSchema = skpdSchema.extend({
    id: z.number().min(1, 'Required ID')
});

export type SkpdFormValues = z.infer<typeof skpdSchema>;
export type SkpdEditValues = z.infer<typeof skpdEditSchema>;
