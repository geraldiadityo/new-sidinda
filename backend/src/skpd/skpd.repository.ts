import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";
import { CreateSkpdDTO } from "./dto/skpd.dto";
import { Prisma, Skpd } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { CacheRepository } from "@/common/cache.repository";

type FindManyArgs = Parameters<PrismaService['skpd']['findMany']>[0];
export type FindAllSkpdArgs = {
    where?: Prisma.SkpdWhereInput;
    take?: number;
    skip?: number;
}
@Injectable()
export class SkpdRepository extends CacheRepository {
    private readonly ctx = SkpdRepository.name;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private prisma: PrismaService
    ) {
        super()
    }

    protected getNamespace(): string {
        return 'skpd'
    }

    async findMany(args: FindManyArgs): Promise<Skpd[]> {
        const cacheKey = this.getCacheKey(args);
        const cachedData = await this.keyv.get<Skpd[]>(cacheKey);
        if(cachedData){
            this.logger.debug('Fetching data from cache',{context: this.ctx});
            return cachedData;
        }
        
        this.logger.debug('Fetching data from db');
        
        const dbData = await this.prisma.skpd.findMany({
            ...args
        });
        await this.keyv.set(cacheKey, dbData);
        return dbData;
    }

    async create(
        data: CreateSkpdDTO
    ): Promise<Skpd> {
        const result = await this.prisma.skpd.create({
            data: data
        });

        await this.invalidateNameSpace();
        return result;
    }

    async update(
        id: number,
        data: Partial<Skpd>,
    ): Promise<Skpd> {
        const result = await this.prisma.skpd.update({
            where: {
                id: id
            },
            data: data
        });

        await this.invalidateNameSpace();
        return result;
    }

    async remove(
        id: number
    ): Promise<Skpd> {
        const result = await this.prisma.skpd.delete({
            where: {
                id: id
            }
        });

        await this.invalidateNameSpace();
        return result;
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