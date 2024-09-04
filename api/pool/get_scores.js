import { prisma } from '../db.js';
import { validate } from '../auth.js';
import { getScore } from '../match.js';

export default async function handler(request, response) {
    const body = request.body;
    const { requestee, id } = body;
    const pool_id = Number.parseInt(id);
    const validationPayload = await validate(requestee.credential);

    if (!validationPayload) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub,
        },
    });

    if (!user) {
        return response.status(404).json({ error: 'User not found' });
    }

    const pool = await prisma.pool.findFirst({
        where: {
            id: pool_id,
        },
        include: {
            users: {
                select: {
                    id: true,
                    display_name: true,
                    image_url: true,
                    predictions: {
                        include: {
                            match: true,
                        },
                    },
                },
            },
        },
    });

    if (!pool) {
        return response.status(404).json({ error: 'Pool not found' });
    }

    // Check if the user is in the pool
    const userInPool = pool.users.some((poolUser) => poolUser.id === user.id);

    if (!userInPool) {
        return response.status(401).json({ error: 'User not in pool' });
    }

    // Calculate the score for each user in the pool based on their predictions
    pool.users.forEach((poolUser) => {
        poolUser.score = poolUser.predictions.reduce((totalScore, prediction) => {
            const match = prediction.match;

            // Add logic to calculate score based on match and prediction data
            //console.log(match, prediction);
            const matchScore = getScore(match, prediction);
            console.log(matchScore);

            return totalScore + matchScore;
        }, 0);
        
    });

    return response.status(200).json({ pool });
}
