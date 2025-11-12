import { useEffect, useMemo, useRef, useState } from "react";

export type ComboboxOptions = {
    value: string;
    label: string;
}

interface ReusableComboboxProps {
    data: ComboboxOptions[];
    value?: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    notFoundText?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export function ReusableCombobox({
    data=[],
    value,
    onChange,
    placeholder="Pilih item",
    searchPlaceholder="cari",
    notFoundText="Tidak ditemukan",
    disabled=false,
    isLoading=false
}: ReusableComboboxProps){
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // cari label dari item yang di pilih
    const selectedLabel = useMemo(() => {
        data.find((item) => item.value === value)?.label
    }, [data, value]);

    // filter data berdasarkan pencarian
    const filteredData = useMemo(() => {
        if(!query) return data;
        return data.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    }, [data, query]);

    // tutup dropdown jika keluar
    useEffect(() => {
        function handlerClikOutside(event: MouseEvent){
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)){
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handlerClikOutside);
        return () => document.removeEventListener("mousedown", handlerClikOutside);
    }, []);
}