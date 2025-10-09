import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { PenggunaService } from "./user.service";
import { PenggunaQueryOption, PenggunaRequestCreate, PenggunaRequestUpdate, PenggunaResponse } from "./user.dto";
import { ApiResponse } from "@/utils/web.model";

@Controller('/api/pengguna/user')
export class PenggunaController {
    constructor(
        private readonly service: PenggunaService
    ) {}

    @Post()
    @HttpCode(201)
    async create(
        @Body() request: PenggunaRequestCreate
    ): Promise<ApiResponse<PenggunaResponse>> {
        const result = await this.service.createPengguna(request);

        return {
            data: result,
            message: `pengguna with name: ${result.nama} and username: ${result.username} was created successfully`
        }
    }

    @Get()
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async getAll(
        @Query() query: PenggunaQueryOption
    ): Promise<ApiResponse<PenggunaResponse[]>>{
        const { data, meta } = await this.service.getAllPengguna(query);

        return {
            data: data,
            message: 'success',
            totalItem: meta.totalItem,
            totalPage: meta.totalPage,
            currentPage: meta.currentPage
        }
    }

    @Get('/:id')
    @HttpCode(200)
    async getById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<PenggunaResponse>> {
        const result = await this.service.penggunaMustExist(id);

        return {
            data: result,
            message: 'success'
        }
    }

    @Patch('/:id')
    @HttpCode(200)
    async upadate(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: PenggunaRequestUpdate
    ): Promise<ApiResponse<PenggunaResponse>> {
        const result = await this.service.updatePengguna(id, request);

        return {
            data: result,
            message: 'Success update data pengguna'
        }
    }

    @Delete('/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<boolean>>{
        const result = await this.service.removePengguna(id);

        return {
            data: true,
            message: `data pengguna with username: ${result.username} and name: ${result.nama} was deleted successfully`
        }
    }
}