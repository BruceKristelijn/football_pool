import { prisma } from './db.js';

async function createListing(client, newListing) {
    const { rows } = await sql`SELECT * from CARTS`;
    return rows;
}

export default async function handler(request, response) {
    const userData = request.body;
    const user = await prisma.user.upsert({
        where: {
            google_id: userData.sub,
        },
        update: {},
        create: {
            display_name: userData.name,
            // email: userData.email,
            google_id: userData.sub,
            image_url: userData.picture  
        },
      })

    const userResp = await prisma.user.findMany();

    return response.status(200).json({ userResp });
}