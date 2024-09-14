import { prisma } from './db.js';
import { validate } from './auth.js';
import config from './config.js';

async function createListing(client, newListing) {
    const { rows } = await sql`SELECT * from CARTS`;
    return rows;
}

export default async function handler(request, response) {
    // const userData = request.body;
    const token = request.body;

    const validationPayload = await validate(token);
    // console.log('validationPayload', validationPayload);

    if(validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const user_id = validationPayload.sub;

    const user = await prisma.user.upsert({
        where: {
            google_id: validationPayload.sub,
        },
        update: {},
        create: {
            display_name: validationPayload.name,
            google_id: validationPayload.sub,
            image_url: validationPayload.picture ?? ""  
        },
      })

    const userResp = await prisma.user.findFirst({
        where: {
            google_id: validationPayload.sub,
        },
    });
    
    return response.status(200).json(JSON.stringify({payload : validationPayload, user : user}));
}