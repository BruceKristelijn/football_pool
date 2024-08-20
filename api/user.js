import { prisma } from './db.js';

async function createListing(client, newListing) {
    const { rows } = await sql`SELECT * from CARTS`;
    return rows;
}

export default async function handler(request, response) {
    const newUser = await prisma.user.create({
        data: {
            name: 'Elliott',
            email: 'xelliottx@example-user.com',
        },
    });

    const users = await prisma.user.findMany();

    return response.status(200).json({ message: rows });
}