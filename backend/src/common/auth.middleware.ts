import { PayloadDecoded } from "@/auth/auth.dto";
import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { KEYV_INSTANCE } from "./keyv.provider";
import Keyv from "keyv";

interface FastifyRequestWithUser extends FastifyRequest {
    user: PayloadDecoded;
    cookies: Record<string, string>;
    routerPath: string;
    path: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        @Inject(KEYV_INSTANCE) private keyv: Keyv
    ) {}

    private parseCookies(cookieHeader: string): Record<string, string>{
        if(!cookieHeader) return {};

        return cookieHeader.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = decodeURIComponent(value);
            return acc;
        }, {});
    }

    async use(req: any, res: FastifyReply, next: (error?: any) => void) {
        if(req.method === 'OPTIONS'){
            return next();
        }
        if(req.routerPath === '/api/auth/login' && req.method === 'POST'){
            return next();
        }

        const barierToken = req.headers['authorization']?.split(' ')[1];
        
        const cookies = this.parseCookies(req.headers.cookie);
        const cookieToken = cookies['token'];


        const token = barierToken || cookieToken;


        if(!token){
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }

        try {
            const decoded = this.jwtService.verify<PayloadDecoded>(token);
            if(!decoded){
                throw new HttpException('Token are not provided', HttpStatus.UNAUTHORIZED);
            }

            if(!decoded.jti){
                throw new HttpException('Invalid token, (missing JTI)', HttpStatus.UNAUTHORIZED);
            }
            const isDenied = await this.keyv.get(decoded.jti);
            if(isDenied){
                throw new HttpException('Token has been revoked', HttpStatus.UNAUTHORIZED);
            }

            req.user = decoded;
            next();
        } catch (err){
            throw new HttpException(`Token validation failed: ${err.message}`, HttpStatus.UNAUTHORIZED)
        }
    }
}