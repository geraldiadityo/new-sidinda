import { Module } from "@nestjs/common";
import { RoleRepository } from "./role/role.repository";
import { RoleService } from "./role/role.service";
import { RoleController } from "./role/role.controller";
import { PenggunaRepository } from "./user/user.repository";
import { PenggunaService } from "./user/user.service";
import { SkpdModule } from "@/skpd/skpd.module";
import { PenggunaController } from "./user/user.controller";

@Module({
    imports: [
        SkpdModule,
    ],
    providers: [
        // Role
        RoleRepository,
        RoleService,
        // user
        PenggunaRepository,
        PenggunaService
    ],
    controllers: [
        RoleController,
        PenggunaController
    ],
    exports: [
        RoleService,
        PenggunaService
    ]
})
export class PenggunaModule {}