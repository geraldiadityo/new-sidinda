import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";
import { CreateSkpdDTO } from "./dto/skpd.dto";
import { Prisma, Skpd } from "@prisma/client";

type FindManyArgs = Parameters<PrismaService['skpd']['findMany']>[0];
export type FindAllSkpdArgs = {
    where?: Prisma.SkpdWhereInput;
    take?: number;
    skip?: number;
}
@Injectable()
export class SkpdRepository {
    constructor(
        private prisma: PrismaService
    ) { }

    async findMany(args: FindManyArgs): Promise<Skpd[]> {
        return await this.prisma.skpd.findMany({
            ...args
        });
    }

    async create(
        data: CreateSkpdDTO
    ): Promise<Skpd> {
        return await this.prisma.skpd.create({
            data: data
        })
    }

    async update(
        id: number,
        data: Partial<Skpd>,
    ): Promise<Skpd> {
        return await this.prisma.skpd.update({
            where: {
                id: id
            },
            data: data
        })
    }

    async remove(
        id: number
    ): Promise<Skpd> {
        return await this.prisma.skpd.delete({
            where: {
                id: id
            }
        });
    }

    async findAll(args: FindAllSkpdArgs): Promise<Skpd[]> {
        return await this.findMany(args);
    }

    async findById(id: number): Promise<Skpd | null> {
        return await this.prisma.skpd.findUnique({
            where: {
                id: id
            }
        });
    }

    async findByName(nama: string): Promise<Skpd | null> {
        return await this.prisma.skpd.findUnique({
            where: {
                nama: nama
            }
        });
    }

    async countAll(where?: Prisma.SkpdWhereInput): Promise<number> {
        return await this.prisma.skpd.count({where});
    }
}