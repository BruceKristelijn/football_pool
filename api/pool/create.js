import { prisma } from '../db.js';

export default async function handler(request, response) {
    const body = request.body;
    const { name, inviteOnly, userData } = body;

    const newPool = await prisma.pool.create({
        data: {
            name,
            inviteOnly,
            users: {
                connect: { id: userData.local_id }
            }
        },
    });

    return response.status(200).json({ pool: newPool });

}