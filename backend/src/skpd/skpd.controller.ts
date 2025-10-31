import { Controller, HttpCode, Post, Body, Get, UsePipes, ValidationPipe, Query, Param, ParseIntPipe, Put, Delete } from "@nestjs/common";
import { SkpdService } from "./skpd.service";
import { CreateSkpdDTO, SkpdQueryDTO, SkpdResponse } from "./dto/skpd.dto";
import { ApiResponse } from "@/utils/web.model";

@Controller('/api/skpd')
export class SkpdController {
    constructor(
        private readonly service: SkpdService
    ) {}

    @Post()
    @HttpCode(201)
    async create(
        @Body() request: CreateSkpdDTO
    ): Promise<ApiResponse<SkpdResponse>> {
        const result = await this.service.createSkpd(request);

        return {
            data: result,
            message: `Skpd With name ${result.nama} was created successfully`
        }
    }

    @Get()
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async getAll(
        @Query() query: SkpdQueryDTO
    ): Promise<ApiResponse<SkpdResponse[]>> {
        const { data, meta } = await this.service.getAll(query);

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
    ): Promise<ApiResponse<SkpdResponse>> {
        const result = await this.service.skpdMustExist(id);

        return {
            data: result,
            message: 'success'
        }
    }

    @Put('/:id')
    @HttpCode(200)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: CreateSkpdDTO
    ): Promise<ApiResponse<SkpdResponse>> {
        const result = await this.service.updateSkpd(id, request);

        return {
            data: result,
            message: `Skpd with id: ${id} was updated successfully`
        }
    }

    @Delete('/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<boolean>> {
        const result = await this.service.removeSkpd(id);

        return {
            data: true,
            message: `Skpd with name ${result.nama} was deleted successfully`
        }
    }
}