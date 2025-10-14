import { useCreateRole } from "@/lib/actions/master/role";
import { toast } from "sonner";

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
    })
}