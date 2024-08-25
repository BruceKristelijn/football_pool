import { prisma } from '../db.js';
import { validate } from '../auth.js';

export default async function handler(request, response) {
    const body = request.body;
    const { name, inviteOnly, owner } = body;

    console.log('Log:', body);

    const validationPayload = await validate(owner.credential);
    console.log('validationPayload', validationPayload);

    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });

    const newPool = await prisma.pool.create({
        data: {
            name: name,
            inviteOnly: inviteOnly || false,
            description: '',
            users: {
                connect: {
                    id: user.id
                }
            },
            owner: {
                connect: {
                    id: user.id
                }
            }
        }
    });

    return response.status(200).json({ newPool: newPool });

}