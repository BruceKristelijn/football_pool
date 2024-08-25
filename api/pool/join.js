import { prisma } from '../db.js';
import { validate } from '../auth.js';

export default async function handler(request, response) {
    const body = request.body;
    const { id, user } = body;
    const validationPayload = await validate(user.credential);

    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const db_user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });

    if (!db_user) {
        return response.status(404).json({ error: 'User not found' });
    }
    
    console.log('Log:', body);
    const poolId = Number.parseInt(id);

    // Find the pool by ID
    const pool = await prisma.pool.findUnique({
        where: {
            id: poolId
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

    if (!pool) {
        return response.status(404).json({ error: 'Pool not found' });
    }

    // Check if the user is already in the pool
    const isUserInPool = pool.users.some(user => user.id === validationPayload.userId);

    if (isUserInPool) {
        return response.status(400).json({ error: 'User already joined the pool' });
    }

    // Add the user to the pool
    await prisma.pool.update({
        where: {
            id: poolId
        },
        data: {
            users: {
                connect: {
                    id: db_user.id
                }
            }
        }
    });

    // Fetch the updated pool with the new user added
    const updatedPool = await prisma.pool.findUnique({
        where: {
            id: poolId
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

    return response.status(200).json({ pool: updatedPool, message: 'User successfully joined the pool' });
}
