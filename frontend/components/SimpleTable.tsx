"use client";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface SimpleTableData<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

interface SimpleTableProps<TData, TValue> {
    tableData: SimpleTableData<TData, TValue>;
    renderActions?: (rowData: Row<TData>) => React.ReactNode;
}

export function SimpleTable<TData, TValue>({
    tableData,
    renderActions
}: SimpleTableProps<TData, TValue>) {
    const { columns, data } = tableData;
    const tableColumns = [...columns];
    if(renderActions){
        tableColumns.push({
            id: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex space-x-2 justify-center">
                    {renderActions(row)}
                </div>
            )
        })
    }

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <div className='rounded-sm border'>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className='h-24 text-center'>
                                no result
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}