const config = {
    "api_url": "https://api.football-data.org/v4/",
    "team": {
        "id": 675,
        "name": "Feyenoord Rotterdam",
        "shortName": "Feyenoord",
        "tla": "FEY",
        "crest": "https://crests.football-data.org/675.png"
    },
    "competition": {
        "id": 2003,
        "name": "Eredivisie",
        "code": "DED",
        "type": "LEAGUE",
        "emblem": "https://crests.football-data.org/ED.png"
    },
    "admins": process.env.ADMIN_EMAILS.split(','),

};

export default config;