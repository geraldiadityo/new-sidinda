import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs';

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

    await prisma.pengguna.create({
        data: {
            username: 'geraldi',
            nama: 'Geraldi adityo',
            roleId: role.id,
            skpdId: skpd.id,
            password: bcrypt.hashSync('Ge@140019', 10)
        }
    });

    console.log('seeder success...!');
}

main()
    .catch(e => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

