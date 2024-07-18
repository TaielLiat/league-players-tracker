const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_API_KEY = process.env.RIOT_API_KEY;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

let players = [];

app.post('/add_player', async (req, res) => {
    const { gameName, tagLine } = req.body;

    if (players.some(player => player.name === gameName)) {
        return res.status(400).json({ message: 'Player already exists' });
    }

    try {
        const accountResponse = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        });

        const puuid = accountResponse.data.puuid;

        const summonerResponse = await axios.get(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        });

        const encryptedSummonerId = summonerResponse.data.id;

        const leagueResponse = await axios.get(`https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`, {
            headers: { 'X-Riot-Token': RIOT_API_KEY }
        });
        console.log('Summoner Response:', leagueResponse.data); // Logging response for debugging
        if (leagueResponse.data.length === 0) {
            return res.status(404).json({ message: 'No league data found for the summoner' });
        }

        const playerData = {
            name: gameName,
            wins: leagueResponse.data[2].wins,
            losses: leagueResponse.data[2].losses,
            tier: leagueResponse.data[2].tier,
            rank: leagueResponse.data[2].rank,
            leaguePoints: leagueResponse.data[2].leaguePoints
        };

        players.push(playerData);

        res.json({ message: 'Player added successfully', playerData });

    } catch (error) {
        console.error('Error adding player:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error adding player', error: error.response ? error.response.data : error.message });
    }
});


app.get('/players', (req, res) => {
    res.json(players);
});

app.delete('/delete-player/:name', (req, res) => {
    const { name } = req.params;
    const playerIndex = players.findIndex(player => player.name === name);

    if (playerIndex !== -1) {
        players.splice(playerIndex, 1);
        res.json({ message: 'Player deleted successfully' });
    } else {
        res.status(404).json({ message: 'Player not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
