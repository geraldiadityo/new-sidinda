import { useCreateRole } from "@/lib/actions/master/role";
import { toast } from "sonner";
import { RoleForm } from "./RoleForm";

export function AddRoleForm({
    onSuccess,
    onCancel
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
}) {
    const { mutate: createRoleMutate, isPending } = useCreateRole({
        mutationConfig: {
            onSuccess: (data) => {
                toast(data.message);
                onSuccess?.()
            }
        }
    });

    return (
        <RoleForm
            onSubmit={(value) => createRoleMutate(value)}
            onCancel={onCancel}
            isSubmitting={isPending}
            mode="create"
        />
    )
}