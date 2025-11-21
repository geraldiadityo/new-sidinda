import { z } from 'zod';

export const authSchema = z.object({
    username: z.string().min(1, 'Min 1 character for username').max(100, 'Max size character is 100'),
    password: z.string().min(8, 'Minimal 8 character')
});

export const otpSchema = z.object({
    otp: z.string().min(6, 'Kode OTP Minimal 6 digit')
});

export type AuthFormValues = z.infer<typeof authSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
