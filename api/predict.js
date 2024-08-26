import { stringify } from 'postcss';
import { prisma } from './db.js';
import config from './config.json' assert { type: "json" };
import { validate } from './auth.js';

// https://www.football-data.org/documentation/quickstart

export default async function handler(request, response) {
    const body = request.body;
    const { user, new_prediction } = body;

    console.log(new_prediction);

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

    const match_id = request.query.id;

    const prediction = await prisma.prediction.upsert({
        where: {
            matchId_userId: {
                matchId: "" + (match_id),
                userId: db_user.id
            }
        },
        update: {
            halftimeScoreHome: new_prediction.halftime.home || 0,
            halftimeScoreAway: new_prediction.halftime.away || 0,
            fulltimeScoreHome: new_prediction.final.home || 0,
            fulltimeScoreAway: new_prediction.final.away || 0
        },
        create: {
            halftimeScoreHome: new_prediction.halftime.home || 0,
            halftimeScoreAway: new_prediction.halftime.away || 0,
            fulltimeScoreHome: new_prediction.final.home || 0,
            fulltimeScoreAway: new_prediction.final.away || 0,
            userId: db_user.id,
            matchId: "" + (match_id)
        },
    })

    return response.status(200).json(prediction);
}