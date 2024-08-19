import config from './config.json' assert { type: "json" };

// https://www.football-data.org/documentation/quickstart
export default async function handler(request, response) {
    const res = await fetch(`${config.api_url}/teams/${config.team.id}/matches`, {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_KEY
        }
    });

    const data = await res.json();
    return response.status(200).json(data);
}