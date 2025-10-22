import { useCreateSkpd } from "@/lib/actions/master/skpd";
import { toast } from "sonner";
import { SkpdForm } from "./SkpdForm";

export function AddSkpdForm({
    onSuccess,
    onCancel
}: {
    onSuccess?:() => void;
    onCancel?:() => void;
}) {
    const { mutate: createSkpdMutate, isPending } = useCreateSkpd({
        mutationConfig: {
            onSuccess: (data) => {
                toast.success(data.message);
                onSuccess?.()
            }
        }
    });

    return (
        <SkpdForm
            onSubmit={(values) => createSkpdMutate(values)}
            onCancel={onCancel}
            isSubmitting={isPending}
            mode="create"
        />
    )
}