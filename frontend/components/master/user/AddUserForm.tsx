import { useCreateUser } from "@/lib/actions/master/user";
import { toast } from "sonner";
import { UserForm } from "./UserForm";

export function AddUserForm({
    onSuccess,
    onCancel
}: {
    onSuccess?: () => void;
    onCancel?: () => void;
}) {
    const {mutate: createUserMutate, isPending} = useCreateUser({
        mutationConfig: {
            onSuccess: (data) => {
                toast.success(data.message);
                onSuccess?.()
            }
        }
    });

    return (
        <UserForm
            onSubmit={(values) => createUserMutate(values)}
            onCancel={onCancel}
            isSubmitting={isPending}
        />
    )
}