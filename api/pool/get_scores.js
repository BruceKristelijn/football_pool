import { prisma } from '../db.js';
import { validate } from '../auth.js';
import config from '../config.js';
import { getScore } from '../match.js';

export default async function handler(request, response) {
    const body = request.body;
    const { requestee, id } = body;
    const pool_id = Number.parseInt(id);
    const validationPayload = await validate(requestee.credential);

    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });

    const pool = await prisma.pool.findFirst({
        where: {
            id: pool_id
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

    // Check if user is in the pool
    let userInPool = false;
    for (let i = 0; i < pool.users.length; i++) {
        if (pool.users[i].id === user.id) {
            userInPool = true;
            break;
        }
    }

    if (!userInPool) {
        return response.status(401).json({ error: 'User not in pool' });
    }

    // Get all matches and predictions for the pool
    const res = await fetch(`${config.api_url}/teams/${config.team.id}/matches`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
    });

    const data = await res.json();
    for (let i = 0; i < data.matches.length; i++) {
        for (let j = 0; j < pool.users.length; j++) {
            const score = await getScore(data.matches[i], pool.users[j].id);
            if(!pool.users[j].score)
                pool.users[j].score = 0;

            pool.users[j].score += score;
        }
    }

    return response.status(200).json({ pool: pool });

}