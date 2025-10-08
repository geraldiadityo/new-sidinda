import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class SkpdQueryDTO {
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

export class CreateSkpdDTO {
    nama: string;
}

export class SkpdResponse {
    id: number;
    nama: string;
}