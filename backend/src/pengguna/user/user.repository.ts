import { PrismaService } from "@/common/prisma.service";
import { Injectable } from "@nestjs/common";
import { PenggunaCreateDTO } from "./user.dto";
import { Pengguna, Prisma } from "@prisma/client";

type FindManyArgs = Parameters<PrismaService['pengguna']['findMany']>[0];
export type FindAllPenggunaArgs = {
    where?: Prisma.PenggunaWhereInput;
    take?: number;
    skip?: number;
}

@Injectable()
export class PenggunaRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async findMany(args: FindManyArgs): Promise<Pengguna[]> {
        return await this.prisma.pengguna.findMany({
            ...args,
            include: {
                role: true,
                skpd: true
            }
        });
    }

    async create(
        data: PenggunaCreateDTO,
        tx?: Prisma.TransactionClient
    ): Promise<Pengguna> {
        const prismaClient = tx || this.prisma;
        return await prismaClient.pengguna.create({
            data: data,
            include: {
                role: true,
                skpd: true
            }
        })
    };

    async update(
        id: number,
        data: Partial<Pengguna>,
        tx?: Prisma.TransactionClient
    ): Promise<Pengguna> {
        const prismaClient = tx || this.prisma;

        return await prismaClient.pengguna.update({
            where: {
                id: id,
            },
            data: data,
            include: {
                role: true,
                skpd: true
            }
        })
    }

    async remove(
        id: number
    ): Promise<Pengguna>{
        return await this.prisma.pengguna.delete({
            where: {
                id: id
            },
            include: {
                role: true,
                skpd: true
            }
        })
    }

    async findAll(args: FindAllPenggunaArgs): Promise<Pengguna[]> {
        return await this.findMany(args);
    }

    async findById(
        id: number
    ): Promise<Pengguna | null> {
        return await this.prisma.pengguna.findUnique({
            where: {
                id: id
            },
            include: {
                role: true,
                skpd: true
            }
        })
    }

    async findByUsername(
        username: string,
        tx?: Prisma.TransactionClient
    ): Promise<Pengguna | null> {
        const prismaClient = tx || this.prisma;
        return await prismaClient.pengguna.findUnique({
            where: {
                username: username
            },
            include: {
                role: true,
                skpd: true
            }
        })
    }

    async countAll(where?: Prisma.PenggunaWhereInput): Promise<number> {
        return await this.prisma.pengguna.count({where})
    }
}