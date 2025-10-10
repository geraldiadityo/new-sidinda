import { FastifyReply } from "fastify";
import { CookieSerializeOptions } from '@fastify/cookie';

declare module 'fastify' {
    interface FastifyRequest {
        cookie: {
            [key: string]: string;
        };
    }

    interface FastifyReply {
        cookie(name: string, value: string, options?: CookieSerializeOptions): FastifyReply;
        clearCookie(name: string, options?: CookieSerializeOptions): FastifyReply;
    }
}