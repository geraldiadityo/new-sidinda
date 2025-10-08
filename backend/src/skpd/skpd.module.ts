import { Module } from "@nestjs/common";
import { SkpdRepository } from "./skpd.repository";
import { SkpdService } from "./skpd.service";
import { SkpdController } from "./skpd.controller";

@Module({
    providers: [
        SkpdRepository,
        SkpdService
    ],
    controllers: [SkpdController],
    exports: [SkpdService]
})
export class SkpdModule {}