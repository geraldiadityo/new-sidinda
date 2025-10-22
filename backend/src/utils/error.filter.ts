import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { Catch } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
    private readonly context = ErrorFilter.name;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<FastifyRequest>();
        const response = ctx.getResponse<FastifyReply>();
        
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = exception.getResponse();

        let errorMessage: string | object;
        
        if(typeof exceptionResponse === 'string'){
            errorMessage = exceptionResponse;
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse){
            errorMessage = (exceptionResponse as any).message;
        } else {
            errorMessage = 'An unexpected error occured';
        }

        this.logger.warn(
            `[${request.method}] - ${request.url} - Status: ${status} - Error: ${JSON.stringify(errorMessage)}`,
            {
                context: this.context
            }
        )

        response.status(status).send({
            message: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
}