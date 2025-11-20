import { Body, Controller, HttpCode, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Throttle } from "@nestjs/throttler";
import { SetAuthInterceptor } from "./interceptor/set-auth.interceptor";
import { LoginRequestDTO, Verify2faDTO } from "./auth.dto";
import { ClearAuthCookieInterceptor } from "./interceptor/clear-auth.interceptor";
import { JwtPreAuthGuard } from "./jwt-pre-auth.guard";
import type { FastifyRequest } from "fastify";

@Controller('/api/auth')
export class AuthController {
    constructor(
        private service: AuthService
    ) {}

    @Throttle({ default: { limit: 5, ttl: 10000 } })
    // @UseInterceptors(SetAuthInterceptor)
    @Post('/login')
    @HttpCode(200)
    async login(
        @Body() request: LoginRequestDTO
    ) {
        const user = await this.service.validate(request);
        return await this.service.loginStep1(user);
    }

    @Throttle({ default: { limit: 5, ttl: 10000 } })
    @UseGuards(JwtPreAuthGuard)
    @UseInterceptors(SetAuthInterceptor)
    @Post('/2fa/verify')
    async verify2FA(
        @Req() req: FastifyRequest | any,
        @Body() body: Verify2faDTO
    ){
        const userId = req.user.sub;
        const result = await this.service.verify2Fa(userId, body.otp);

        return {
            user: result.user,
            token: result.token,
            message: 'verify berhasil'
        }
    }

    @UseInterceptors(ClearAuthCookieInterceptor)
    @Post('/logout')
    @HttpCode(200)
    async logout(){
        return;
    }
}