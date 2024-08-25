import { prisma } from '../db.js';
import { validate } from '../auth.js';

export default async function handler(request, response) {
    const body = request.body;
    const { id, user, owner } = body;
    
    const validationPayload = await validate(owner.credential);
    
    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const db_owner_user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });

    if (!db_owner_user) {
        return response.status(404).json({ error: 'User not found' });
    }

    const db_user_to_remove = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    if (!db_user_to_remove) {
        return response.status(404).json({ error: 'User not found' });
    }
        
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

    // If owns the pool
    if (db_owner_user.id !== pool.ownerId) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    console.log('db_user_to_remove', db_user_to_remove);

    // Remove the user from the pool
    await prisma.pool.update({
        where: {
            id: poolId
        },
        data: {
            users: {
                disconnect: {
                    id: db_user_to_remove.id
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

    console.log('updatedPool', updatedPool);
    return response.status(200).json({ pool: updatedPool, message: 'User kicked.' });
}
