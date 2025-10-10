import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { JwtModule } from '@nestjs/jwt';
import { loggerConfig } from "./logger.config";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from "./prisma.service";
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { keyvProvider } from "./keyv.provider";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ErrorFilter } from "@/utils/error.filter";
import { AuthMiddleware } from "./auth.middleware";
@Global()
@Module({
    imports: [
        WinstonModule.forRoot(loggerConfig),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ([{
                ttl: configService.get('THROTTLER_TTL', 60000),
                limit: configService.get('THROTTLER_LIMIT', 100),
            }])
        }),
        ConfigModule.forRoot({
            isGlobal: true
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET_KEY');
                return {
                    secret: secret,
                    signOptions: {
                        expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`
                    }
                }
            }
        }),
    ],
    providers: [
        PrismaService,
        keyvProvider,
        {
            provide: APP_FILTER,
            useClass: ErrorFilter
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
    exports: [
        PrismaService,
        keyvProvider,
        JwtModule
    ]
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware)
        .exclude({
            path: '/api/auth/login',
            method: RequestMethod.POST
        })
        .exclude({
            path: '/api/auth/logout',
            method: RequestMethod.POST
        })
        .forRoutes({
            path: '/api/*',
            method: RequestMethod.ALL
        })
    }
}