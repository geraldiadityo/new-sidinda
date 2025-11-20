import { SkpdResponse } from "@/skpd/dto/skpd.dto";
import { RoleResponse } from "../role/role.dto";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class PenggunaQueryOption {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number = 5;

    @IsOptional()
    @IsString()
    keyword?: string
}

export class PenggunaRequestCreate {
    username: string;
    nama: string;
    roleId: number;
    skpdId: number;
    password: string;
    confirm_password: string;
}

export class PenggunaRequestUpdate {
    username: string;
    nama: string;
    roleId: number;
    skpdId: number;
    password?: string;
    confirm_password?: string;
}

export class PenggunaCreateDTO {
    username: string;
    nama: string;
    roleId: number;
    skpdId: number;
    password: string;
    twoFASecret: string;
}

export class PenggunaResponse {
    id: number;
    username: string;
    nama: string;
    role: RoleResponse;
    skpd: SkpdResponse;
}

export class PenggunaResWithSecret extends PenggunaResponse {
    twoFASecret: string;
}