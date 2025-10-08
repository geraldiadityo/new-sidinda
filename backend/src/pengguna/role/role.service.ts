import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { RoleRepository } from "./role.repository";
import { Role } from "@prisma/client";
import { RoleCreateDTO, RoleResponse } from "./role.dto";

@Injectable()
export class RoleService {
    private readonly ctx = RoleService.name;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly repo: RoleRepository
    ) {}

    private toRoleResponse(role: Role): RoleResponse {
        return {
            id: role.id,
            nama: role.nama
        }
    }

    private async checkName(
        nama: string
    ): Promise<RoleResponse | null> {
        this.logger.debug(`starting search role with name: ${nama}`,{context: this.ctx});
        const data = await this.repo.findByName(nama);
        if(!data){
            return null;
        }

        return this.toRoleResponse(data)
    }

    async roleMustExist(
        id: number
    ): Promise<RoleResponse> {
        this.logger.debug(`searching role with id: ${id}`,{context: this.ctx});
        const data = await this.repo.findById(id);

        if(!data){
            this.logger.warn(`role with id: ${id}`,{context: this.ctx});
            throw new HttpException('Role is not found', HttpStatus.NOT_FOUND);
        }

        return this.toRoleResponse(data);
    }

    async createRole(
        data: RoleCreateDTO
    ): Promise<RoleResponse> {
        this.logger.info(`starting create role with name: ${data.nama}`,{context: this.ctx});
        const checkName = await this.checkName(data.nama);
        if(checkName){
            this.logger.warn(`role with name: ${data.nama} has already exists`,{context: this.ctx});
            throw new HttpException('Role has already exists', HttpStatus.BAD_REQUEST);
        }

        const newRole = await this.repo.create(data);
        this.logger.info(`Role with name: ${newRole.nama} was created successfully`,{context: this.ctx});
        return this.toRoleResponse(newRole);
    }

    async updateRole(
        id: number,
        data: RoleCreateDTO
    ): Promise<RoleResponse> {
        this.logger.info(`starting update role with id: ${id}`,{context: this.ctx});
        const currentData = await this.roleMustExist(id);
        if(data.nama !== currentData.nama) {
            const checkName = await this.checkName(data.nama);
            if(checkName){
                this.logger.warn(`role with name: ${data.nama} has already exists`,{context: this.ctx});
                throw new HttpException('Role has already exists', HttpStatus.BAD_REQUEST);
            }
        }

        const updatedRole = await this.repo.update(currentData.id, data);
        this.logger.info(`role with id ${updatedRole.id} was updated successfully`,{context: this.ctx});
        return this.toRoleResponse(updatedRole);
    }

    async removeRole(
        id: number
    ): Promise<RoleResponse> {
        this.logger.info(`starting remove role with id: ${id}`,{context: this.ctx});
        const currentData = await this.roleMustExist(id);

        const removedData = await this.repo.remove(currentData.id);
        this.logger.info(`role ${removedData.nama} was removed successfully`,{context: this.ctx});
        return this.toRoleResponse(removedData);
    }

    async getAllRole(): Promise<RoleResponse[]> {
        const listData = await this.repo.findAll();

        return listData.map((item) => this.toRoleResponse(item));
    }
}