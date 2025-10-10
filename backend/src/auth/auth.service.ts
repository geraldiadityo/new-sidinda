import { KEYV_INSTANCE } from "@/common/keyv.provider";
import { PenggunaService } from "@/pengguna/user/user.service";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Keyv from "keyv";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { LoginRequestDTO, LoginResponse, PayloadDecoded } from "./auth.dto";
import { v4 as uuidv4 } from 'uuid';

import { PenggunaResponse } from "@/pengguna/user/user.dto";
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
    private readonly ctx = AuthService.name;
    constructor(
        private readonly penggunaService: PenggunaService,
        private jwtService: JwtService,
        @Inject(KEYV_INSTANCE) private keyv: Keyv,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async validate(data: LoginRequestDTO): Promise<PenggunaResponse> {
        this.logger.debug(`starting searching user with username: ${data.username}`,{context: this.ctx});
        const user = await this.penggunaService.checkUsername(data.username);
        if(!user){
            this.logger.warn(`user with username: ${data.username} is not found`,{context: this.ctx});
            throw new HttpException('username or password is incorrect', HttpStatus.UNAUTHORIZED);
        }

        if(!bcrypt.compareSync(data.password, user.password)){
            this.logger.warn('password is invalid',{context: this.ctx});
            throw new HttpException('username or password is incorrect', HttpStatus.UNAUTHORIZED);
        }

        const validatedUser = await this.penggunaService.penggunaMustExist(user.id);
        return validatedUser;
    }

    async login(
        user: PenggunaResponse
    ): Promise<LoginResponse> {
        this.logger.debug(`starting sign in user with username: ${user.username}`,{context: this.ctx});
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role,
            skpd: user.skpd,
            jti: uuidv4()
        };

        return {
            data: user,
            token: this.jwtService.sign(payload)
        }
    }
}