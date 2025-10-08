import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, Injectable } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Catch(HttpException)
@Injectable()
export class ErrorFilter implements ExceptionFilter {
    private readonly context = ErrorFilter.name;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception.getStatus();

        if(exception instanceof ThrottlerException) {
            this.logger.warn('rate limit exceed', {context: this.context});
            response.status(status).json({
                data: null,
                message: 'to many request, try again later'
            });
        } else {
            response.status(status).json({
                data: null,
                message: exception.getResponse()
            })
        }
    }
}