import { encrypt } from "../src/utils/encryption.utils";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs';
import { authenticator } from "otplib";
import * as qrcodeTerminal from 'qrcode-terminal';

const prisma = new PrismaClient();
async function main() {
    console.log('seeder starting....');
    const skpd = await prisma.skpd.create({
        data: {
            nama: 'Diskominfo'
        }
    });

    const role = await prisma.role.create({
        data: {
            nama: 'Superadmin'
        }
    });

    const username = 'geraldi';
    const rawSecret = authenticator.generateSecret();
    const encryptedSecret = encrypt(rawSecret);
    const otpAuth = authenticator.keyuri(username, 'SIDINDA-LOCAL', rawSecret);
    
    await prisma.pengguna.create({
        data: {
            username: username,
            nama: 'Geraldi adityo',
            roleId: role.id,
            skpdId: skpd.id,
            password: bcrypt.hashSync('Ge@140014', 10),
            twoFASecret: encryptedSecret
        }
    });

    console.log('====================================================');
    console.log(`✅ User seeded successfully!`);
    console.log(`🔑 Password: Ge@140019`);
    console.log(`----------------------------------------------------`);
    console.log(`📲 2FA SECRET (Manual Entry): ${rawSecret}`);
    console.log(`----------------------------------------------------`);
    console.log(`📷 SCAN QR CODE DI BAWAH INI DENGAN HP ANDA:`);

    qrcodeTerminal.generate(otpAuth, { small: true });

    console.log('====================================================');
}

main()
    .catch(e => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

