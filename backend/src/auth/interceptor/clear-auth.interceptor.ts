import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { mergeMap, Observable } from "rxjs";
import { FastifyReply, FastifyRequest } from "fastify";

@Injectable()
export class ClearAuthCookieInterceptor implements NestInterceptor {
    constructor(
        private authService: AuthService
    ) {}

    private parseCookies(cookieHeader: string): Record<string, string>{
        if(!cookieHeader) return {};

        return cookieHeader.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = decodeURIComponent(value);
            return acc;
        }, {});
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>  {
        const reply = context.switchToHttp().getResponse<FastifyReply>();
        const request = context.switchToHttp().getRequest();

        const token = this.parseCookies(request.headers.cookie)['token'];
        if(!token){
            throw new HttpException('User has been logout or not have session active', HttpStatus.UNAUTHORIZED);
        }
        return next.handle().pipe(
            mergeMap(async () => {
                if(token){
                    await this.authService.logout(token);

                    reply.clearCookie('token', {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        path: '/'
                    });

                    reply.clearCookie('user', {
                        httpOnly: false,
                        secure: false,
                        sameSite: 'lax',
                        path: '/'
                    });

                    return {
                        message: 'logout success',
                        data: true
                    }
                }
            })
        )
    }
}