import { prisma } from '../db.js';
import { validate } from '../auth.js';

export default async function handler(request, response) {
    const body = request.body;
    const { name, inviteOnly, owner } = body;
    const validationPayload = await validate(owner.credential);

    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });

    try {
        const pools = await prisma.pool.findMany({
            where: {
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        display_name: true,
                        image_url: true
                        // Add any other fields you want to include
                    }
                }
            }
        });

        return response.status(200).json({ pools: pools });
    } catch (error) {
        console.error(error);
        return response.status(200).json([]);
    }

}