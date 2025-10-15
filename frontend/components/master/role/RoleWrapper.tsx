"use client";

import { useDeleteRole, useGetRoles } from "@/lib/actions/master/role";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

interface DataRoles {
    columns: ColumnDef<Role>[];
};

export default function RoleWrapper({
    initialData
}: { initialData: DataRoles }){
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

        
    }
}