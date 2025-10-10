import { Global, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { JwtModule } from '@nestjs/jwt';
import { loggerConfig } from "./logger.config";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from "./prisma.service";
import { ThrottlerModule } from '@nestjs/throttler';
import { keyvProvider } from "./keyv.provider";
import { APP_FILTER } from "@nestjs/core";
import { ErrorFilter } from "@/utils/error.filter";
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
        }
    ],
    exports: [
        PrismaService,
        keyvProvider
    ]
})
export class CommonModule {}