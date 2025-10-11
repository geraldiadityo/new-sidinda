"use client";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    Row,
    useReactTable
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from './ui/table';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { useDebounceCallback } from '@/hooks/useDebounce';
import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

interface TableData<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    metadata: {
        total: number;
        page: number;
        pageSize: number;
        searchQuery?: string
    }
}

interface DataTableProps<TData, TValue> {
    tableData: TableData<TData, TValue>;
    pageSizeOptions?: number[];
    renderActions?: (rowData: Row<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
    tableData,
    pageSizeOptions = [5, 10, 20, 30, 50, 100],
    renderActions,
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const { columns, data, metadata } = tableData;
    const { total, page, pageSize, searchQuery = '' } = metadata;

    const tableColumns = [...columns];
    if(renderActions){
        tableColumns.push({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className='flex space-x-2 justify-center'>
                    {renderActions(row)}
                </div>
            ),
        })
    }

    // create table with @tanstack/react-table
    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(total/pageSize),
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize
            },
        }
    });

    // create query string for searching row in table
    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        return params.toString();
    }

    const handleSearch = (query: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('search', query);
        params.set('page', '1');
        router.push(`${pathName}?${params.toString()}`);
    }

    // pagination handler
    const handlePageChange = (newPage: number) => {
        router.push(`${pathName}?${createQueryString('page', String(newPage))}`);
    }

    const handlePageSizeChange = (newSize: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('pageSize', String(newSize));
        params.set('page', '1');
        router.push(`${pathName}?${params.toString()}`);
    }

    // debounce search in table
    const debounceSearch = useDebounceCallback((query: string) => {
        handleSearch(query);
    }, 500);

    
    return (
        <div className='space-y-4'>
            {/* bar pencarian */}
            <div className='flex items-center justify-between py-4'>
                <div className='relative w-full max-w-md'>
                    <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                    <Input
                        placeholder='Search...'
                        defaultValue={searchQuery}
                        onChange={(e) => debounceSearch(e.target.value)}
                        className='pl-9 w-full'
                    />
                </div>
                <div className='flex items-center space-x-2'>
                    <p className='text-sm font-medium'>Rows Per Page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            handlePageSizeChange(Number(value))
                        }}
                    >
                        <SelectTrigger className='h-8 w-[70px]'>
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side='top'>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='rounded-md border'>
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
                                <TableRow key={row.id}>
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
                                    No result
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                <div className='text-sm text-mutated-foreground'>
                    Show {data.length} of {total} entries
                </div>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <div className='flex items-center space-x-2'>
                        <p className='text-sm font-medium'>Go to page</p>
                        <Input
                            type='number'
                            value={page}
                            onChange={(e) => {
                                const newPage = e.target.value ? Number(e.target.value) : 1;
                                handlePageChange(Math.max(1, Math.min(newPage, Math.ceil(total/pageSize))))
                            }}
                            className='w-16 h-8'
                            min={1}
                            max={Math.ceil(total/pageSize)}
                        />
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            disabled={page === 1}
                        >
                            First
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.min(page + 1, Math.ceil(total/pageSize)))}
                            disabled={page === Math.ceil(total/pageSize)}
                        >
                            Next
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.ceil(total/pageSize))}
                            disabled={page === Math.ceil(total/pageSize)}
                        >
                            Last
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

}