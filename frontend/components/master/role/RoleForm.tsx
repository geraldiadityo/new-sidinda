import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RoleFormValues, roleSchema } from "@/lib/validation/master/role-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface RoleFormProps {
    defaultValues?: RoleFormValues;
    onSubmit: (values: RoleFormValues) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    mode?: 'create' | 'update'
}

export function RoleForm({
    defaultValues,
    onSubmit,
    onCancel,
    isSubmitting=false,
    mode='create'
}: RoleFormProps) {
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
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
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="masukan nama role"
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
                        {isSubmitting ? (mode === 'create' ? 'adding...' : 'updating...') : (mode === 'create' ? 'Save' : 'Update')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}