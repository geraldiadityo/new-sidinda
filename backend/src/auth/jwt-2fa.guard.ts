import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PayloadDecoded } from "./auth.dto";

@Injectable()
export class Jwt2faGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user as PayloadDecoded;
        
        if(!user){
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        if(user.isTwoFactorAuthenticated !== true){
            throw new HttpException('2FA verification is required', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}