import config from './config.json' assert { type: "json" };
import { prisma } from './db.js';
import { getMatchPrediction } from './match.js';
import { validate } from './auth.js';

// https://www.football-data.org/documentation/quickstart

export default async function handler(request, response) {
    const body = request.body;
    const { user } = body;

    const validationPayload = await validate(user.credential);
    if(validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }
    
    const db_user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });
    
    const res = await fetch(`${config.api_url}/teams/${config.team.id}/matches`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
    });

    const data = await res.json();
    for (let i = 0; i < data.matches.length; i++) {
        const prediction = await getMatchPrediction(data.matches[i].id, db_user.id);
        if (prediction) {
            data.matches[i].prediction = prediction;
        }        
    }
    return response.status(200).json(data);
}