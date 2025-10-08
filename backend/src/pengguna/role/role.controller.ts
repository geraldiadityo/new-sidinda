import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleCreateDTO, RoleResponse } from "./role.dto";
import { ApiResponse } from "@/utils/web.model";

@Controller('/api/pengguna/role')
export class RoleController {
    constructor(
        private readonly service: RoleService
    ) {}

    @Post()
    @HttpCode(201)
    async create(
        @Body() request: RoleCreateDTO
    ): Promise<ApiResponse<RoleResponse>> {
        const result = await this.service.createRole(request);

        return {
            data: result,
            message: `success created role with name: ${result.nama}`
        }
    }

    @Get()
    @HttpCode(200)
    async getAll(): Promise<ApiResponse<RoleResponse[]>> {
        const result = await this.service.getAllRole();

        return {
            data: result,
            message: 'success'
        }
    }

    @Put('/:id')
    @HttpCode(200)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: RoleCreateDTO
    ): Promise<ApiResponse<RoleResponse>> {
        const result = await this.service.updateRole(id, request);

        return {
            data: result,
            message: 'Role successfully updated'
        }
    }

    @Delete('/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<boolean>> {
        const result = await this.service.removeRole(id);

        return {
            data: true,
            message: `Role ${result.nama} was removed successfully`
        }
    }

    @Get('/:id')
    @HttpCode(200)
    async getById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<RoleResponse>> {
        const result = await this.service.roleMustExist(id);

        return {
            data: result,
            message: 'success'
        }
    }
}