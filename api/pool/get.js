import { prisma } from '../db.js';
import { validate } from '../auth.js';

export default async function handler(request, response) {
    const body = request.body;
    const { id, owner } = body;
    const validationPayload = await validate(owner.credential);

    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const pool = await prisma.pool.findUnique({
        where: {
            id: Number.parseInt(id)
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

    return response.status(200).json({ pool: pool });

}