import { UserFormValues, userSchema } from "@/lib/validation/master/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
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
    })
}