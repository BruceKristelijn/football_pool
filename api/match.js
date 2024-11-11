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
        return { score, explainer: { firstHalf: 0, secondHalf: 0, multiplier: 1 } };
    }

    if(match.utcDate > new Date()) {
        return { score, explainer: { firstHalf: 0, secondHalf: 0, multiplier: 1 } };
    }

    let halftimeWinnerCorrect = false;
    let fulltimeWinnerCorrect = false;
    let halftimeScoreCorrect = 0;
    let fulltimeScoreCorrect = 0;

    // Explanation object to store points breakdown
    let explainer = {
        firstHalf: 0,
        secondHalf: 0,
        multiplier: 1
    };

    // Determine halftime winner or duel (10 points)
    const halftimeMatchResult = match.halfTimeHome === match.halfTimeAway ? 'draw' : (match.halfTimeHome > match.halfTimeAway ? 'home' : 'away');
    const halftimePredictionResult = prediction.halftimeScoreHome === prediction.halftimeScoreAway ? 'draw' : (prediction.halftimeScoreHome > prediction.halftimeScoreAway ? 'home' : 'away');
    if (halftimeMatchResult === halftimePredictionResult) {
        score += 10;
        explainer.firstHalf += 10; // Track the points from the first half
        halftimeWinnerCorrect = true;
    }

    // Determine fulltime winner or duel (10 points)
    const fulltimeMatchResult = match.fullTimeHome === match.fullTimeAway ? 'draw' : (match.fullTimeHome > match.fullTimeAway ? 'home' : 'away');
    const fulltimePredictionResult = prediction.fulltimeScoreHome === prediction.fulltimeScoreAway ? 'draw' : (prediction.fulltimeScoreHome > prediction.fulltimeScoreAway ? 'home' : 'away');
    if (fulltimeMatchResult === fulltimePredictionResult) {
        score += 10;
        explainer.secondHalf += 10; // Track the points from the second half
        fulltimeWinnerCorrect = true;
    }

    // Correct halftime scores (7 points per side, max 14)
    if (match.halfTimeHome === prediction.halftimeScoreHome) {
        score += 7;
        explainer.firstHalf += 7; // Add 7 points to first half if home score is correct
        halftimeScoreCorrect += 7;
    }
    if (match.halfTimeAway === prediction.halftimeScoreAway) {
        score += 7;
        explainer.firstHalf += 7; // Add 7 points to first half if away score is correct
        halftimeScoreCorrect += 7;
    }

    // Correct fulltime scores (7 points per side, max 14)
    if (match.fullTimeHome === prediction.fulltimeScoreHome) {
        score += 7;
        explainer.secondHalf += 7; // Add 7 points to second half if home score is correct
        fulltimeScoreCorrect += 7;
    }
    if (match.fullTimeAway === prediction.fulltimeScoreAway) {
        score += 7;
        explainer.secondHalf += 7; // Add 7 points to second half if away score is correct
        fulltimeScoreCorrect += 7;
    }

    // Check for perfect prediction (double multiplier if 100% correct)
    if (
        halftimeWinnerCorrect &&
        fulltimeWinnerCorrect &&
        halftimeScoreCorrect === 14 &&
        fulltimeScoreCorrect === 14
    ) {
        score *= 2;
        explainer.multiplier = 2; // Apply multiplier if all is 100% correct
    }

    return { score, explainer };
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

    if (!match) {
        return response.status(404).json({ error: 'Match not found' });
    }

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