import storage from 'redux-persist/lib/storage';

const createNoopStorage = () => {
    return {
        getItem(_key: string){
            return Promise.resolve(null);
        },
        setItem(_key: string, value: any){
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        }
    }
}

const customStorage = typeof window !== 'undefined' ? storage : createNoopStorage();

export default customStorage;
