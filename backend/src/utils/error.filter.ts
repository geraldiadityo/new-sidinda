import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, Injectable } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { FastifyReply } from "fastify";
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
        const response = ctx.getResponse<FastifyReply>();
        const status = exception.getStatus();

        let responseBody: any;
        let statusCode: number;

        if(exception instanceof ThrottlerException) {
            this.logger.warn('rate limit exceed', {context: this.context});
            statusCode = status;
            responseBody = {
                data: null,
                message: 'to Many request, try again later'
            }
        } else {
            statusCode = status;
            responseBody = {
                data: null,
                message: exception.getResponse()
            }
        }

        response.statusCode = status;
        response.send(responseBody)
    }
}