import { Inject } from "@nestjs/common";
import { KEYV_INSTANCE } from "./keyv.provider";
import Keyv from "keyv";

export abstract class CacheRepository {
    @Inject(KEYV_INSTANCE) protected keyv: Keyv;

    protected abstract getNamespace(): string;;
    
    protected async invalidateNameSpace(): Promise<void>{
        const cacheWithNamespace = new Keyv({ store: this.keyv.opts.store, namespace: this.getNamespace() });
        await cacheWithNamespace.clear();
    }

    protected getCacheKey(args: any): string {
        const queryHash = JSON.stringify(args || {});
        return `${this.getNamespace()}:${queryHash}`;
    }
}