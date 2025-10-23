import { useUpdateSkdp } from "@/lib/actions/master/skpd";
import { SkpdEditValues, SkpdFormValues } from "@/lib/validation/master/skpd-validation";
import { toast } from "sonner";
import { SkpdForm } from "./SkpdForm";

interface EditSkpdFormProps {
    defaultValues: SkpdEditValues;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function EditSkpdForm({
    defaultValues,
    onSuccess,
    onCancel
}: EditSkpdFormProps){
    const {id, ...values} = defaultValues;

    const { mutate: updateSkpdMutate, isPending } = useUpdateSkdp({
        mutationConfig: {
            onSuccess: (data) => {
                toast.success(data.message);
                onSuccess?.()
            },
            onError: (err) => {
                toast.error(err.message);
            }
        }
    });

    const handleSubmit = (values: SkpdFormValues) => {
        updateSkpdMutate({id, data: values});
    }

    return (
        <SkpdForm
            defaultValues={values}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isSubmitting={isPending}
            mode="update"
        />
    )
}