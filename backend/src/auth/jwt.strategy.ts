import { KEYV_INSTANCE } from "@/common/keyv.provider";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport'
import Keyv from "keyv";
import { Strategy } from "passport-jwt";
import { FastifyRequest } from "fastify";
import { PayloadDecoded } from "./auth.dto";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        @Inject(KEYV_INSTANCE) private keyv: Keyv
    ) {
        super({
            jwtFromRequest: (req: FastifyRequest) => {
                if(req?.cookie?.token){
                    return req.cookie.token
                }
                return null
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY', 'secretKey')
        })
    }

    async validate(payload: PayloadDecoded): Promise<any> {
        if(!payload.jti){
            throw new HttpException('Token is missing, JWT ID', HttpStatus.UNAUTHORIZED);
        }

        const isDenied = await this.keyv.get(payload.jti);
        if(isDenied){
            throw new HttpException('Token has revoked', HttpStatus.UNAUTHORIZED);
        }

        return {
            username: payload.username,
            userId: payload.sub,
            role: payload.role,
            skpd: payload.skpd
        }
    }
}