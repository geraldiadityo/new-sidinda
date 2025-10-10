import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { map, Observable, tap } from "rxjs";

@Injectable()
export class SetAuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const reply = context.switchToHttp().getResponse<FastifyReply>();
        
        return next.handle().pipe(
            tap((data) => {
                if(data?.token){
                    reply.cookie('token', data.token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        maxAge: 1000 * 60 * 60 * 24,
                        path: '/'
                    })
                }

                if(data?.user){
                    reply.cookie('user', JSON.stringify(data.user), {
                        httpOnly: false,
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 1000 * 60 * 60 * 24,
                        path: '/'
                    })
                }
            }),
            map(() => {
                return {
                    message: 'Login Succes',
                    data: true
                }
            })
        )
    }
}