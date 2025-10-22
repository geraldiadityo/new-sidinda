declare type ResponsesDataCommon<T> = {
    data: T[];
}

declare type ResponsesWithTotal<T> = {
    data: T[];
    total: number;
}

declare type ResponseWithPaginated<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

declare type ResponseDataCommon<T> = {
    data: T;
    message: string;
}

declare type Role = {
    id: number;
    nama: string;
}

declare type Skpd = {
    id: number;
    nama: string;
}
