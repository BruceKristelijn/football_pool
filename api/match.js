import config from './config.json' assert { type: "json" };

// https://www.football-data.org/documentation/quickstart

export default async function handler(request, response) {
    const id = request.query.id;
    const res = await fetch(`${config.api_url}/matches/${id}`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
    });

    const data = await res.json();
    return response.status(200).json(data);
}