import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { SkpdRepository } from "./skpd.repository";
import { Prisma, Skpd } from "@prisma/client";
import { CreateSkpdDTO, SkpdQueryDTO, SkpdResponse } from "./dto/skpd.dto";

@Injectable()
export class SkpdService {
    private readonly ctx = SkpdService.name;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly repo: SkpdRepository
    ){}

    private toSkpdResponse(data: Skpd): SkpdResponse {
        return {
            id: data.id,
            nama: data.nama,
        }
    }

    private async checkName(
        nama: string
    ): Promise<SkpdResponse | null>{
        this.logger.debug(`searching skpd with name: ${nama}`,{context: this.ctx});
        const data = await this.repo.findByName(nama);

        if(!data){
            return null;
        }

        return this.toSkpdResponse(data);
    }

    async skpdMustExist(
        id: number
    ): Promise<SkpdResponse> {
        this.logger.debug(`find skpd by id: ${id}`,{context: this.ctx});
        const data = await this.repo.findById(id);

        if(!data){
            this.logger.warn(`skpd with id: ${id} is not found`,{context: this.ctx});
            throw new HttpException('SKPD is not found', HttpStatus.NOT_FOUND);
        }

        return this.toSkpdResponse(data)
    }

    async createSkpd(
        data: CreateSkpdDTO
    ): Promise<SkpdResponse> {
        this.logger.info(`starting create new skpd with name: ${data.nama}`,{context: this.ctx});
        const checkName = await this.checkName(data.nama);
        if(checkName){
            this.logger.warn(`this skpd with name: ${data.nama} has already exists`,{context: this.ctx});
            throw new HttpException('SKPD has already exists', HttpStatus.BAD_REQUEST);
        }

        const newSkpd = await this.repo.create(data);
        this.logger.info(`Create skpd with name: ${data.nama} was successfully`,{context: this.ctx});
        return this.toSkpdResponse(newSkpd);
    }

    async updateSkpd(
        id: number,
        data: CreateSkpdDTO
    ): Promise<SkpdResponse> {
        this.logger.info(`starting update skpd with id: ${id}`,{context: this.ctx});
        const currentData = await this.skpdMustExist(id);
        if(data.nama !== currentData.nama){
            const checkName = await this.checkName(data.nama);
            if(checkName){
                this.logger.warn(`skpd with name: ${data.nama} has already exist`,{context: this.ctx});
                throw new HttpException('SKPD has already exists', HttpStatus.BAD_REQUEST);
            }
        }

        const newData = await this.repo.update(currentData.id, data);
        this.logger.info(`skpd with id: ${id} was updated successfully`,{context: this.ctx});
        return this.toSkpdResponse(newData);
    }

    async removeSkpd(
        id: number
    ): Promise<SkpdResponse> {
        this.logger.info(`starting remove skpd with id: ${id}`,{context: this.ctx});
        const currentData = await this.skpdMustExist(id);
        
        const removedData = await this.repo.remove(currentData.id);
        this.logger.info(`removing data skpd with name: ${removedData.nama} was successfully`,{context: this.ctx});
        return this.toSkpdResponse(removedData);
    }

    async getAll(
        query: SkpdQueryDTO
    ): Promise<{
        data: SkpdResponse[],
        meta: any
    }> {
        this.logger.debug('get all data with dynamic query',{context: this.ctx});
        const { page, pageSize, keyword } = query;
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const where: Prisma.SkpdWhereInput = keyword && keyword.trim() !== '' ? {
            OR: [
                { nama: { contains: keyword, mode: 'insensitive' } }
            ]
        } : {}

        const [listData, totalItem] = await Promise.all([
            this.repo.findAll({
                where: where,
                take: take,
                skip: skip
            }),
            this.repo.countAll(where)
        ]);

        if(listData.length === 0){
            return {
                data: [],
                meta: {
                    totalItem: 0,
                    totalPage: 0,
                    currentPage: 1
                }
            }
        }

        const totalPage = Math.ceil(totalItem/pageSize);
        return {
            data: listData.map((item) => this.toSkpdResponse(item)),
            meta: {
                totalItem: totalItem,
                totalPage: totalPage,
                currentPage: page
            }
        }
    }
}