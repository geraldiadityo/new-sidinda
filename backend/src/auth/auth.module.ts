import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./auth.service";
import { ClearAuthCookieInterceptor } from "./interceptor/clear-auth.interceptor";
import { PenggunaModule } from "@/pengguna/pengguna.module";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        PenggunaModule,
    ],
    providers: [
        AuthService,
        ClearAuthCookieInterceptor,
        JwtStrategy
    ],
    controllers: [AuthController]
})
export class AuthModule {}