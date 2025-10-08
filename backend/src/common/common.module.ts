import { Global, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { loggerConfig } from "./logger.config";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from "./prisma.service";
import { ThrottlerModule } from '@nestjs/throttler';
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
    ],
    providers: [
        PrismaService
    ],
    exports: [
        PrismaService
    ]
})
export class CommonModule {}