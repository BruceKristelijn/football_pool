import { stringify } from 'postcss';
import { prisma } from './db.js';
import config from './config.js';
import { validate } from './auth.js';

// https://www.football-data.org/documentation/quickstart

export default async function handler(request, response) {
    if (request.method === 'POST') {
        return getMatch(request, response);
    } else {
        return response.status(405).json({ error: 'Method not allowed' });
    }
}

export async function getMatchPrediction(match_id, user_id) {
    const prediction = await prisma.prediction.findFirst({
        where: {
            matchId: match_id,
            userId: Number.parseInt(user_id)
        }
    });

    return prediction;
}

export function getScore(match, prediction) {
    let score = 0;

    if (!prediction) {
        return score;
    }

    if (match.fullTimeAway === prediction.halftimeScoreAway) {
        score += 3;
    }
    if (match.halfTimeHome === prediction.halftimeScoreHome) {
        score += 3;
    }
    if (match.fullTimeAway === prediction.halftimeScoreAway && match.halfTimeHome === prediction.halftimeScoreHome) {
        score += 4;
    }

    if (match.fullTimeAway === prediction.fulltimeScoreAway) {
        score += 3;
    }
    if (match.fullTimeHome === prediction.fulltimeScoreHome) {
        score += 3;
    }
    if (match.fullTimeAway === prediction.fulltimeScoreAway && match.fullTimeHome === prediction.fulltimeScoreHome) {
        score += 4;
    }

    return score;
}

async function getMatch(request, response) {
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

    if(db_user === undefined) {
        return response.status(404).json({ error: 'User not found' });
    }

    const id = request.query.id;
    const match = await prisma.match.findFirst({
        where: {
            externalId: Number.parseInt(id)
        }
    });

    const data = match;
    const prediction = await getMatchPrediction(data.id, db_user.id);
    if (prediction) {
        data.prediction = prediction;
    }

    const score = getScore(data, prediction);
    if (score) {
        data.user_score = score;
    }

    return response.status(200).json(data);
}