import { RoleResponse } from "@/pengguna/role/role.dto";
import { PenggunaResponse } from "@/pengguna/user/user.dto";
import { SkpdResponse } from "@/skpd/dto/skpd.dto";

export class PayloadDecoded {
    username: string;
    sub: number;
    role: RoleResponse;
    skpd: SkpdResponse;
    jti: string;
    iat: number;
    exp: number;
    isTwoFactorAuthenticated: boolean;
}

export class LoginRequestDTO {
    username: string;
    password: string;
}

export class LoginResponse {
    data: PenggunaResponse;
    token: string;
}

export class Verify2faDTO {
    otp: string;
}