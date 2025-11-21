import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PayloadDecoded } from "./auth.dto";

@Injectable()
export class JwtPreAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user || (request.raw || request.raw.user) as PayloadDecoded;

        if(!user){
            throw new HttpException('Token expired or invalid', HttpStatus.UNAUTHORIZED);
        }

        request.user = user.user

        return true;
    }
}