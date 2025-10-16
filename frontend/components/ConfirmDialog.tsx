import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { ButtonProps, buttonVariants } from "./ui/button";

interface ConfirmDialogProps {
    trigger: React.ReactNode;
    title: string;
    description: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isPending?: boolean;
    confirmText?: string;
    pendingText?: string;
    cancelText?: string;
    confirmVarian?: ButtonProps['variant']
};

export function ConfirmDialog({
    title,
    trigger,
    description,
    open,
    onOpenChange,
    onConfirm,
    isPending=false,
    confirmText='Confirm',
    pendingText='Loading...',
    cancelText='Cancel',
    confirmVarian='destructive'
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isPending}
                        className={buttonVariants({ variant: confirmVarian })}
                    >
                        {isPending ? pendingText : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}