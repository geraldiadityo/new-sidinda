import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PenggunaRepository } from "./user.repository";
import { RoleService } from "../role/role.service";
import { SkpdService } from "@/skpd/skpd.service";
import { PenggunaCreateDTO, PenggunaQueryOption, PenggunaRequestCreate, PenggunaRequestUpdate, PenggunaResponse, PenggunaResWithSecret } from "./user.dto";
import * as bcrypt from 'bcryptjs';
import { Pengguna, Prisma } from "@prisma/client";
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { encrypt } from "@/utils/encryption.utils";
@Injectable()
export class PenggunaService {
    private readonly ctx = PenggunaService.name;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly repo: PenggunaRepository,
        private readonly roleService: RoleService,
        private readonly skpdService: SkpdService,
    ) {}

    private toPenggunaResponse(data: any): PenggunaResponse {
        return {
            id: data.id,
            username: data.username,
            nama: data.nama,
            role: data.role,
            skpd: data.skpd
        }
    }

    private toPenggunaResponseWithSecret(data: any): PenggunaResWithSecret {
        return {
            id: data.id,
            username: data.username,
            nama: data.nama,
            role: data.role,
            skpd: data.skpd,
            twoFASecret: data.twoFASecret
        }
    }

    async checkUsername(
        username: string
    ): Promise<Pengguna | null>{
        this.logger.debug(`search pengguna with username: ${username}`,{context: this.ctx});
        const data = await this.repo.findByUsername(username);
        if(!data){
            return null;
        }

        return data;
    }

    async penggunaMustExist(
        id: number
    ): Promise<PenggunaResponse> {
        this.logger.debug(`searching pengguna with id: ${id}`,{context: this.ctx});
        const data = await this.repo.findById(id);

        if(!data){
            this.logger.warn(`pengguna with id: ${id} is not found`,{context: this.ctx});
            throw new HttpException('Pengguna is not found', HttpStatus.NOT_FOUND);
        }

        return this.toPenggunaResponse(data);
    }

    async penggunaMustExistWtihSecret (
        id: number
    ): Promise<PenggunaResWithSecret> {
        this.logger.debug(`Searching pengguna with id: ${id}`, {context: this.ctx});
        const data = await this.repo.findById(id);
        if(!data){
            this.logger.warn(`Pengguna with id: ${id} is not found`,{context: this.ctx});
            throw new HttpException('Pengguna is not found', HttpStatus.NOT_FOUND);
        }

        return this.toPenggunaResponseWithSecret(data);
    }

    async createPengguna(
        data: PenggunaRequestCreate
    ): Promise<PenggunaResponse & {qrcodeUrl: string}> {
        this.logger.info(`starting create pengguna with name: ${data.nama} with username: ${data.username}`,{context: this.ctx});
        const checkUsername = await this.checkUsername(data.username);
        if(checkUsername){
            this.logger.error(`username ${data.username} has already exists`,{context: this.ctx});
            throw new HttpException('Username has already exists',HttpStatus.BAD_REQUEST);
        }
        const role = await this.roleService.roleMustExist(data.roleId);
        const skpd = await this.skpdService.skpdMustExist(data.skpdId);

        if(data.password !== data.confirm_password){
            this.logger.error('Password and confirm password do not match',{context: this.ctx});
            throw new HttpException('Password and Confirm password do not match', HttpStatus.BAD_REQUEST);
        }

        data.password = await bcrypt.hash(data.password, 10);
        const secret = authenticator.generateSecret();
        const encryptedSecret = encrypt(secret);
        const dataSender: PenggunaCreateDTO = {
            username: data.username,
            nama: data.nama,
            roleId: role.id,
            skpdId: skpd.id,
            password: data.password,
            twoFASecret: encryptedSecret
        }

        const newPengguna = await this.repo.create(dataSender);
        const otpAuthUrl = authenticator.keyuri(
            newPengguna.username,
            'SIDINDA-APPS',
            secret
        );
        const qrcodeUrl = await qrcode.toDataURL(otpAuthUrl);

        this.logger.info(`pengguna with username: ${newPengguna.username} was create successfully`,{context: this.ctx});
        return {
            ...this.toPenggunaResponse(newPengguna),
            qrcodeUrl
        }
    }

    async updatePengguna(
        id: number,
        data: PenggunaRequestUpdate
    ): Promise<PenggunaResponse> {
        this.logger.info(`starting update pengguna with id: ${id}`,{context: this.ctx});
        const currentData = await this.penggunaMustExist(id);
        if(data.username !== currentData.username){
            const checkUsername = await this.checkUsername(data.username);
            if(checkUsername){
                this.logger.warn(`username ${data.username} has already exist`,{context: this.ctx});
                throw new HttpException('Username already exist', HttpStatus.BAD_REQUEST);
            }
        }
        const role = await this.roleService.roleMustExist(data.roleId);
        const skpd = await this.skpdService.skpdMustExist(data.skpdId);
        const dataSender: PenggunaRequestUpdate = {
            username: data.username,
            nama: data.nama,
            roleId: role.id,
            skpdId: skpd.id
        }

        if(data.password && data.password.trim() !== ''){
            if(data.password !== data.confirm_password){
                this.logger.warn('password and confirm password do not matched',{context: this.ctx});
                throw new HttpException('Password and confirm password do not matched', HttpStatus.BAD_REQUEST);
            }

            const newPassword = await bcrypt.hash(data.password, 10);

            dataSender.password = newPassword
        }

        const updatedPengguna = await this.repo.update(currentData.id, dataSender);
        this.logger.info(`pengguna with id: ${updatedPengguna.id} was updated successfully`,{context: this.ctx})

        return this.toPenggunaResponse(updatedPengguna);
    }

    async removePengguna(
        id: number
    ): Promise<PenggunaResponse> {
        this.logger.info(`starting remove pengguna with id: ${id}`,{context: this.ctx});
        const currentData = await this.penggunaMustExist(id);

        const removedPengguna = await this.repo.remove(currentData.id);
        this.logger.info(`pengguna with id: ${id} was removed successfully`,{contex: this.ctx});

        return this.toPenggunaResponse(removedPengguna);
    }

    async getAllPengguna(
        query: PenggunaQueryOption
    ): Promise<{
        data: PenggunaResponse[],
        meta: any
    }> {
        this.logger.debug(`get all data pengguna with dynamic query`,{context: this.ctx});
        const { page, pageSize, keyword } = query;
        
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const where: Prisma.PenggunaWhereInput = keyword && keyword.trim() !== '' ? {
            OR: [
                { nama: { contains: keyword, mode: 'insensitive' } },
                { username: { contains: keyword, mode: 'insensitive' } }
            ]
        } : {};
        
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
                meta:{
                    totalItem: 0,
                    totalPage: 0,
                    currentPage: 1,
                }
            }
        }

        const totalPage = Math.ceil(totalItem/pageSize);
        return {
            data: listData.map((item) => this.toPenggunaResponse(item)),
            meta: {
                totalItem: totalItem,
                totalPage: totalPage,
                currentPage: page
            }
        }
    }
}