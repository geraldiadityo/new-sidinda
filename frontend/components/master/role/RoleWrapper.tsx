"use client";

import { Button } from "@/components/ui/button";
import { useDeleteRole, useGetRoles } from "@/lib/actions/master/role";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { EditRoleForm } from "./EditForm";
import { ActDialog } from "@/components/ActDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AddRoleForm } from "./AddForm";
import { SimpleTable } from "@/components/SimpleTable";

interface DataRoles {
    columns: ColumnDef<Role>[];
};

export default function RoleWrapper({
    initialData
}: { initialData: DataRoles }){
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { columns } = initialData;
    const { data: roles, isLoading, isError } = useGetRoles();

    const tableData = {
        columns: columns,
        data: roles?.data ?? []
    }

    const renderActions = (row: Row<Role>) => {
        const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
        const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
        const { mutate: deleterRoleMutate, isPending } = useDeleteRole({
            mutationConfig: {
                onSuccess: (resp) => {
                    toast.success(resp.message);
                    setIsDeleteDialogOpen(false);
                }
            }
        });

        return (
            <div className="flex space-x-2">
                <ActDialog
                    title="Edit Form"
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    trigger={
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                        >
                            Edit
                        </Button>
                    }
                >
                    <EditRoleForm
                        defaultValues={row.original}
                        onSuccess={() => setIsEditDialogOpen(false)}
                        onCancel={() => setIsEditDialogOpen(false)}
                    />
                </ActDialog>
                <ConfirmDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    title="Apakah anda yakin"
                    description={
                        <>
                            Data role <strong>{row.original.nama}</strong> akan di hapus secara permanent.
                            tindakan ini tidak dapat di batalkan
                        </>
                    }
                    onConfirm={() => {
                        deleterRoleMutate(row.original.id)
                    }}
                    isPending={isPending}
                    confirmText="Ya, Hapus"
                    pendingText="Menghapus..."
                    cancelText="Batal"
                    trigger={
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                        >
                            Hapus
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <>
            <section className="p-2 mt-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <TitleText
                            title="Data Role"
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <ActDialog
                            title="Add Form"
                            open={isAddDialogOpen}
                            onOpenChange={setIsAddDialogOpen}
                            trigger={
                                <Button
                                    variant="default"
                                >
                                    Add Role
                                </Button>
                            }
                        >
                            <AddRoleForm
                                onSuccess={() => setIsAddDialogOpen(false)}
                                onCancel={() => setIsAddDialogOpen(false)}
                            />
                        </ActDialog>
                    </div>
                </div>
                <div className="mt-5">
                    <SimpleTable
                        tableData={tableData}
                        renderActions={renderActions}
                    />
                </div>
            </section>
        </>
    )
}