'use client';
import { useLogin } from "@/hooks/useAuth";
import { AuthFormValues, authSchema } from "@/lib/validation/auth";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../input/PasswordInput";
import { Button } from "../ui/button";

export function LoginForm() {
    const router = useRouter();
    const form = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const { mutate: login, isPending } = useLogin();

    function onSubmit(data: AuthFormValues){
        login(data, {
            onSuccess: () => {
                toast.success('login success');
                router.push('/');
            },
            onError: (err) => {
                toast.error(err.message || 'Terjadi Kesalahan');
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="username"
                                    {...field}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <PasswordInput
                    control={form.control}
                    name="password"
                    label="password"
                    placeholder="enter your password"
                    description="at least minimal 8 character"
                />
                <Button
                    type="submit"
                    className="w-full"
                    variant="default"
                    disabled={isPending}
                >
                    {isPending ? 'sign in...' : 'Login'}
                </Button>
            </form>
        </Form>
    )
}