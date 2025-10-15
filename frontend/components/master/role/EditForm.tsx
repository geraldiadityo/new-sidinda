import { useUpdateRole } from "@/lib/actions/master/role";
import { RoleEditValues, RoleFormValues } from "@/lib/validation/master/role-validation";
import { toast } from "sonner";
import { RoleForm } from "./RoleForm";

interface EditRoleFormProps {
    defaultValues: RoleEditValues;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function EditRoleForm({
    defaultValues,
    onSuccess,
    onCancel
}: EditRoleFormProps) {
    const { id, ...values } = defaultValues;

    const { mutate: updateRoleMutate, isPending } = useUpdateRole({
        mutationConfig: {
            onSuccess: (data) => {
                toast.success(data.message);
                onSuccess?.();
            },
            onError: (err) => {
                toast.error(err.message);
            }
        }
    });

    const handleSubmit = (values: RoleFormValues) => {
        updateRoleMutate({id, data: values});
    };

    return (
        <RoleForm
            defaultValues={values}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isSubmitting={isPending}
        />
    )
}
