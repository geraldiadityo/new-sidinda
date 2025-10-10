import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

export const Auth = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if(user){
            return data ? user[data as keyof typeof user] : user;
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
)