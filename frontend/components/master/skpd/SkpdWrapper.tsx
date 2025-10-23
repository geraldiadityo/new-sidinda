'use client';
import { ActDialog } from "@/components/ActDialog";
import { Button } from "@/components/ui/button";
import { GetSkpdParams, useDeleteSkpd, useGetSkpds } from "@/lib/actions/master/skpd";
import { ColumnDef, Row } from "@tanstack/react-table"
import { useState } from "react";
import { toast } from "sonner";
import { EditSkpdForm } from "./EditSkpdForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import TitleText from "@/components/TitleText";
import { AddSkpdForm } from "./AddSkpdForm";
import { DataTable } from "@/components/DataTable";

interface PageMetaData {
    metadata: {
        page: number,
        pageSize: number,
        searchQuery: string
    }
}

function SkpdActions({ row }: {row: Row<Skpd>}){
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDEleteDialogOpen] = useState(false);
    const skpd = row.original;

    const { mutate: deleteSkpdMutate, isPending } = useDeleteSkpd({
        mutationConfig: {
            onSuccess: (data) => {
                toast.success(data.message);
                setIsDEleteDialogOpen(false);
            }
        }
    });

    return (
        <div className="flex space-x-2">
            <ActDialog
                title="Edit Skpd Form"
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
                <EditSkpdForm
                    defaultValues={skpd}
                    onSuccess={() => setIsEditDialogOpen(false)}
                    onCancel={() => setIsEditDialogOpen(false)}
                />
            </ActDialog>
            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDEleteDialogOpen}
                title="Apakah anda yakin"
                description={
                    <>
                        Data Skpd <strong>{skpd.nama}</strong> akan di hapus secara permanent.
                        Tindakan ini tidak dapat di batalkan
                    </>
                }
                onConfirm={() => {
                    deleteSkpdMutate(skpd.id);
                }}
                isPending={isPending}
                confirmText="Ya, hapus"
                pendingText="Menghapus...."
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

const columns: ColumnDef<Skpd>[] = [
    {
        accessorKey: 'id',
        header: 'ID'
    },
    {
        accessorKey: 'nama',
        header: 'Nama Skpd'
    }
];

export default function SkpdWrapper({
    initData
}: { initData: PageMetaData }){
    const { page, pageSize, searchQuery } = initData.metadata;
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const [params, setParams] = useState<GetSkpdParams>({
        page: page,
        pageSize: pageSize,
        keyword: searchQuery
    });

    const {data, isPending, isError} = useGetSkpds({params});
    
    const tableData = {
        columns: columns,
        data: data?.data ?? [],
        metadata: {
            total: data?.total ?? 0,
            page: params.page,
            pageSize: params.pageSize
        }
    }

    const renderActions = (row: Row<Skpd>) => {
        return <SkpdActions row={row} />;
    }

    return (
        <section className="mt-2 p-2">
            <div className="flex flex-col lg:flex-row justify-between">
                <div className="">
                    <TitleText
                        title="Data Skpd"
                    />
                </div>
                <div className="mt-2 lg:mt-0">
                    <ActDialog
                        title="Add SKPD form"
                        open={isAddDialogOpen}
                        onOpenChange={setIsAddDialogOpen}
                        trigger={
                            <Button
                                type="button"
                                variant="default"
                            >
                                Add Skpd
                            </Button>
                        }
                    >
                        <AddSkpdForm
                            onSuccess={() => setIsAddDialogOpen(false)}
                            onCancel={() => setIsAddDialogOpen(false)}
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