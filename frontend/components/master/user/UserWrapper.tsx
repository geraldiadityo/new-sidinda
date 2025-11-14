"use client";

import { ActDialog } from "@/components/ActDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import { GetUsersParams, useDeleteUser, useGetUsers } from "@/lib/actions/master/user";
import { ColumnDef, Row } from "@tanstack/react-table"
import { useState } from "react";
import { toast } from "sonner";
import { AddUserForm } from "./AddUserForm";
import { DataTable } from "@/components/DataTable";

interface PageMetaData {
    metadata: {
        page: number,
        pageSize: number,
        searchQuery: string
    }
}

const columns: ColumnDef<User>[] = [
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'nama', header: 'Nama' },
    { accessorKey: 'skpd.nama', header: 'SKPD' },
    { accessorKey: 'role.nama', header: 'Role' },
];

function UserActions({row}: {row: Row<User>}){
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const user = row.original;

    const { mutate: deleteUserMutate, isPending } = useDeleteUser({
        mutationConfig: {
            onSuccess: (data) => {
                toast.success(data.message);
                setIsDeleteDialogOpen(false);
            }
        }
    });

    return (
        <div className="flex space-x-2">
            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Apakah anda yakin"
                description={
                    <>
                        Data User <strong>{user.nama}</strong> akan di hapus secara permanent,
                        Tindakan ini tidak dapat di batalkan
                    </>
                }
                onConfirm={() => {
                    deleteUserMutate(user.id)
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

export default function UserWrapper({
    initData
}: { initData: PageMetaData }){
    const { page, pageSize, searchQuery } = initData.metadata;
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

    const params: GetUsersParams = {
        page: page,
        pageSize: pageSize,
        keyword: searchQuery
    }

    const { data, isPending, isError } = useGetUsers({
        param: params
    });

    const tableData = {
        columns: columns,
        data: data?.data ?? [],
        metadata: {
            total: data?.total ?? 0,
            page: params.page,
            pageSize: params.pageSize
        }
    }

    const renderActions = (row: Row<User>) => {
        return <UserActions row={row} />
    }

    return (
        <section className="mt-2 p-2">
            <div className="flex flex-col lg:flex-row justify-between">
                <div className="">
                    <TitleText
                        title="Data user"
                    />
                </div>
                <div className="mt-2 lg:mt-0">
                    <ActDialog
                        title="Add User form"
                        open={isAddUserDialogOpen}
                        onOpenChange={setIsAddUserDialogOpen}
                        trigger={
                            <Button
                                type="button"
                                variant="default"
                            >
                                Add User
                            </Button>
                        }
                    >
                        <AddUserForm
                            onSuccess={() => setIsAddUserDialogOpen(false)}
                            onCancel={() => setIsAddUserDialogOpen(false)}
                        />
                    </ActDialog>
                </div>
            </div>
            <div className="mt-5">
                <DataTable
                    tableData={tableData}
                    renderActions={renderActions}
                />
            </div>
        </section>
    )
}