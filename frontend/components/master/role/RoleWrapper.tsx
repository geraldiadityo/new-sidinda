"use client";

import { useGetRoles } from "@/lib/actions/master/role";
import { ColumnDef } from "@tanstack/react-table";

interface DataRoles {
    columns: ColumnDef<Role>[];
};

export default function RoleWrapper({
    initialData
}: { initialData: DataRoles }){
    const { columns } = initialData;
    const { data: roles, isLoading, isError } = useGetRoles();
}