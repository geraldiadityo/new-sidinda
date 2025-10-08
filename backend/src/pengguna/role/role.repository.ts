import { PrismaService } from "@/common/prisma.service";
import { Injectable } from "@nestjs/common";
import { RoleCreateDTO } from "./role.dto";
import { Role } from "@prisma/client";

@Injectable()
export class RoleRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(
        data: RoleCreateDTO
    ): Promise<Role> {
        return await this.prisma.role.create({
            data: data
        })
    }

    async update(
        id: number,
        data: Partial<Role>
    ): Promise<Role> {
        return await this.prisma.role.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async remove(
        id: number
    ): Promise<Role> {
        return await this.prisma.role.delete({
            where: {
                id: id
            }
        });
    }

    async findAll(): Promise<Role[]> {
        return await this.prisma.role.findMany();
    }

    async findById(
        id: number
    ): Promise<Role | null> {
        return await this.prisma.role.findUnique({
            where: {
                id: id
            }
        });
    }

    async findByName(
        nama: string
    ): Promise<Role | null> {
        return await this.prisma.role.findUnique({
            where: {
                nama: nama
            }
        })
    }
}