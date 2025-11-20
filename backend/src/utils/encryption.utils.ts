import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const algorithm = 'aes-256-ctr';

const secretKey = process.env.ENCRYPTION_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = randomBytes(16);

export const encrypt = (text: string): string => {
    const cipher = createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (hash: string): string => {
    const [ivHex, contentHex] = hash.split(':');
    const decipher = createDecipheriv(algorithm, secretKey, Buffer.from(ivHex, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(contentHex, 'hex')), decipher.final()]);

    return decrpyted.toString();
};