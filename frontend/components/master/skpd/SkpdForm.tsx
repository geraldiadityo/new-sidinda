import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SkpdFormValues, skpdSchema } from "@/lib/validation/master/skpd-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface SkpdFormProps {
    defaultValues?: SkpdFormValues,
    onSubmit: (values: SkpdFormValues) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    mode?: 'create' | 'update';
}

export function SkpdForm({
    defaultValues,
    onSubmit,
    onCancel,
    isSubmitting=false,
    mode='create'
}: SkpdFormProps) {
    const form = useForm<SkpdFormValues>({
        resolver: zodResolver(skpdSchema),
        defaultValues: {
            nama: '',
            ...defaultValues
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama SKPD</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="masukkan nama skpd"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (mode === 'create' ? 'adding...': 'updating...') : (mode === 'create' ? 'create' : 'update')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}