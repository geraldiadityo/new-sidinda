'use client';
import { useLogin, useVerifyOtp } from "@/hooks/useAuth";
import { AuthFormValues, authSchema, OtpFormValues, otpSchema } from "@/lib/validation/auth";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../input/PasswordInput";
import { Button } from "../ui/button";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";

export function LoginForm() {
    const router = useRouter();
    const loginForm = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const otpForm = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ''
        }
    });

    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [tempToken, setTempToken] = useState<string>('');

    const { mutate: login, isPending: isLoginPending } = useLogin();
    const { mutate: verifyOtpMutate, isPending: isVerifyPending } = useVerifyOtp();

    function onLoginSubmit(data: AuthFormValues){
        login(data, {
            onSuccess: (res) => {
                if(res.require2fa && res.tempToken){
                    setTempToken(res.tempToken);
                    setStep('otp');
                    toast.info(res.message);
                }
            },
            onError: (err) => {
                toast.error(err.message);
            }
        });
    };

    function onOtpSubmit(data: OtpFormValues){
        if(!tempToken){
            toast.info('sesi kadaluarsa, mohon login ulang');
            setStep('credentials');
            return;
        }

        verifyOtpMutate({ otp: data.otp, tempToken: tempToken });
    }

    if(step === 'otp'){
        return (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center space-y-2">
                    <h3 className="text-center space-y-2">Verifikasi 2 langkah</h3>
                    <p className="text-sm text-muted-foreground">Masukan 6 digit kode OTP</p>
                </div>
                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                        <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex justify-center">
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isVerifyPending}
                        >
                            { isVerifyPending ? 'Memverifikasi...' : 'Verifikasi' }
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => setStep('credentials')}
                        >
                            Kembali
                        </Button>
                    </form>
                </Form>
            </div>
        )
    }

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="w-full space-y-6">
                <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="username"
                                    {...field}
                                    disabled={isLoginPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <PasswordInput
                    control={loginForm.control}
                    name="password"
                    label="password"
                    placeholder="enter your password"
                    description="at least minimal 8 character"
                />
                <Button
                    type="submit"
                    className="w-full"
                    variant="default"
                    disabled={isLoginPending}
                >
                    {isLoginPending ? 'sign in...' : 'Login'}
                </Button>
            </form>
        </Form>
    )
}