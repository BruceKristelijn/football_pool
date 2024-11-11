import config from './config.js';
import { prisma } from './db.js';
import { getMatchPrediction, getScore } from './match.js';
import { validate } from './auth.js';

// https://www.football-data.org/documentation/quickstart

export default async function handler(request, response) {
    if (request.method === 'POST') {
        return getMatches(request, response);
    }
    if (request.method === 'PUT') {
        console.log(config.admins)
        return putMatches(request, response);
    }
}

/// Gets all matches
async function getMatches(request, response) {
    const body = request.body;
    const { user, search_user_id } = body;

    const validationPayload = await validate(user.credential);
    if (validationPayload === false) {
        return response.status(401).json({ error: 'Invalid token' });
    }

    const db_user = await prisma.user.findUnique({
        where: {
            google_id: validationPayload.sub
        }
    });

    const other_user = await prisma.user.findUnique({
        where: {
            id: search_user_id
        }
    })

    const prediction_query_where = {}, match_query_where = {}
    prediction_query_where.userId = other_user ? other_user.id : db_user.id;

    if (other_user)
        match_query_where.utcDate = {
            lte: new Date()  // Matches with a `utcDate` in the past or equal to now
        }

    const matches = await prisma.match.findMany({
        orderBy: {
            utcDate: 'asc'
        },
        where: match_query_where,
        include: {
            predictions: {
                where: prediction_query_where,
                select: {
                    id: true,
                    halftimeScoreHome: true,
                    halftimeScoreAway: true,
                    fulltimeScoreHome: true,
                    fulltimeScoreAway: true,
                    createdAt: true
                }
            }
        }
    });

    for (let i = 0; i < matches.length; i++) {
        if (matches[i].predictions.length === 0)
            continue;

        const score = await getScore(matches[i], matches[i].predictions[0]);
        matches[i].prediction = matches[i].predictions[0];

        if (score) {
            matches[i].user_score = score;
        }
    }
    return response.status(200).json(matches);
}

/// Updates all matches
async function putMatches(request, response) {
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

    if (!db_user)
        return response.status(401).json({ error: 'Unauthorized' });

    if (!config.admins.includes(validationPayload.email)) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    const { matches } = body;

    try {
        await Promise.all(matches.map(async (match) => {
            await prisma.match.upsert({
                where: { externalId: match.id }, // Assuming `match.id` is the unique external ID
                update: {
                    utcDate: new Date(match.utcDate),
                    status: match.status,
                    matchday: match.matchday,
                    stage: match.stage,
                    group: match.group,
                    lastUpdated: new Date(match.lastUpdated),
                    homeTeamId: match.homeTeam.id,
                    homeTeamName: match.homeTeam.name,
                    homeTeamShort: match.homeTeam.tla,
                    homeTeamCrest: match.homeTeam.crest,
                    awayTeamId: match.awayTeam.id,
                    awayTeamName: match.awayTeam.name,
                    awayTeamShort: match.awayTeam.tla,
                    awayTeamCrest: match.awayTeam.crest,
                    fullTimeHome: match.score.fullTime.home,
                    fullTimeAway: match.score.fullTime.away,
                    halfTimeHome: match.score.halfTime.home,
                    halfTimeAway: match.score.halfTime.away,
                    areaId: match.area.id,
                    areaName: match.area.name,
                    areaCode: match.area.code,
                    areaFlag: match.area.flag,
                    competitionId: match.competition.id,
                    competitionName: match.competition.name,
                    competitionCode: match.competition.code,
                    competitionType: match.competition.type,
                    competitionEmblem: match.competition.emblem,
                    seasonId: match.season.id,
                    seasonStartDate: new Date(match.season.startDate),
                    seasonEndDate: new Date(match.season.endDate),
                    currentMatchday: match.season.currentMatchday,
                    seasonWinner: match.season.winner,
                    referees: {
                        create: match.referees.map((referee) => ({
                            id: referee.id,
                            name: referee.name,
                            type: referee.type,
                            nationality: referee.nationality,
                        }))
                    },  // Assuming referees is a related model
                },
                create: {
                    externalId: match.id,
                    utcDate: new Date(match.utcDate),
                    status: match.status,
                    matchday: match.matchday,
                    stage: match.stage,
                    group: match.group,
                    lastUpdated: new Date(match.lastUpdated),
                    homeTeamId: match.homeTeam.id,
                    homeTeamName: match.homeTeam.name,
                    homeTeamShort: match.homeTeam.tla,
                    homeTeamCrest: match.homeTeam.crest,
                    awayTeamId: match.awayTeam.id,
                    awayTeamName: match.awayTeam.name,
                    awayTeamShort: match.awayTeam.tla,
                    awayTeamCrest: match.awayTeam.crest,
                    fullTimeHome: match.score.fullTime.home,
                    fullTimeAway: match.score.fullTime.away,
                    halfTimeHome: match.score.halfTime.home,
                    halfTimeAway: match.score.halfTime.away,
                    areaId: match.area.id,
                    areaName: match.area.name,
                    areaCode: match.area.code,
                    areaFlag: match.area.flag,
                    competitionId: match.competition.id,
                    competitionName: match.competition.name,
                    competitionCode: match.competition.code,
                    competitionType: match.competition.type,
                    competitionEmblem: match.competition.emblem,
                    seasonId: match.season.id,
                    seasonStartDate: new Date(match.season.startDate),
                    seasonEndDate: new Date(match.season.endDate),
                    currentMatchday: match.season.currentMatchday,
                    seasonWinner: match.season.winner,
                    referees: {
                        create: match.referees.map((referee) => ({
                            id: referee.id,
                            name: referee.name,
                            type: referee.type,
                            nationality: referee.nationality,
                        }))
                    },  // Assuming referees is a related model
                },
            });
        }));

        return response.status(200).json({ message: 'Matches upserted successfully' });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'An error occurred while upserting matches' });
    }
}