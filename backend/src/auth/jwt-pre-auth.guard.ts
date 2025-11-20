import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { PayloadDecoded } from "./auth.dto";

@Injectable()
export class JwtPreAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user as PayloadDecoded;
        
        if(!user){
            throw new HttpException('Token expired or invalid', HttpStatus.UNAUTHORIZED);
        }

        return true;
    }
}