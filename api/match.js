import { stringify } from 'postcss';
import { prisma } from './db.js';
import config from './config.json' assert { type: "json" };
import { validate } from './auth.js';

// https://www.football-data.org/documentation/quickstart

export default async function handler(request, response) {
    const body = request.body;
    const { user } = body;

    const validationPayload = await validate(user.credential);
    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const db_user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });

    const id = request.query.id;
    const res = await fetch(`${config.api_url}/matches/${id}`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
    });

    const data = await res.json();
    const prediction = await getMatchPrediction(data.id, db_user.id);
    if (prediction) {
        data.prediction = prediction;
    }

    return response.status(200).json(data);
}

export async function getMatchPrediction(match_id, user_id) {
    const prediction = await prisma.prediction.findFirst({
        where: {
            matchId: "" + (match_id),
            userId: Number.parseInt(user_id)
        }
    });

    return prediction;
}