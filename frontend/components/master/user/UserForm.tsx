import { PasswordInput } from "@/components/input/PasswordInput";
import { ReusableCombobox } from "@/components/ReusableCombobox";
import { Button } from "@/components/ui/button";
import { Form ,FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounced } from "@/hooks/useDebounce";
import { useGetRoles } from "@/lib/actions/master/role";
import { useGetSkpds } from "@/lib/actions/master/skpd";
import { UserFormValues, userSchema } from "@/lib/validation/master/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface UserFormProps {
    defaultValues?: UserFormValues;
    onSubmit: (values: UserFormValues) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    mode?: 'create'
};

export function UserForm({
    defaultValues,
    onSubmit,
    onCancel,
    isSubmitting=false,
    mode='create'
}: UserFormProps){
    const [skpdQueryKeyword, setSkpdQueryKeyword] = useState("");
    const debouncedSkpKeyword = useDebounced(skpdQueryKeyword, 300);
    const {data: skpdQuery, isLoading} = useGetSkpds({
        params: {
            page: 1,
            pageSize: debouncedSkpKeyword ? 20 : 5,
            keyword: debouncedSkpKeyword
        }
    });

    const skpdOptions = useMemo(() => {
        if(!skpdQuery?.data) return [];
        return skpdQuery.data.map((skpd) => ({
            value: String(skpd.id),
            label: skpd.nama || "tanpa nama"
        }));
    }, [skpdQuery]);

    const {data: roleData, isLoading: roleLoading} = useGetRoles();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: '',
            nama: '',
            roleId: '',
            skpdId: '',
            password: '',
            confirm_password: '',
            ...defaultValues
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="masukan username"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="masukan nama"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roleData?.data.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                {/* skpd selec combo box */}
                <FormField
                    control={form.control}
                    name="skpdId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>SKPD</FormLabel>
                            <FormControl>
                                <ReusableCombobox
                                    value={field.value}
                                    onChange={field.onChange}
                                    data={skpdOptions}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                    onSearchQueryChange={setSkpdQueryKeyword}
                                    placeholder="Pilih SKPD"
                                    searchPlaceholder="Cari SKPD"
                                    notFoundText="SKPD tidak di temukan"
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
                    description="at least min 8 character"
                />
                <PasswordInput
                    control={form.control}
                    name="confirm_password"
                    label="Confirm Password"
                    placeholder="enter confirm password"
                    description="must be same with password"
                />
                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button
                            type="button"
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
                        {isSubmitting ? 'saving' : 'Save'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}