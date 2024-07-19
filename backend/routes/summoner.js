const express = require('express');
const router = express.Router();
const riotApi = require('../config/riotApi');

router.get('/:summonerName', async (req, res) => {
  try {
    const summonerName = req.params.summonerName;
    const summonerResponse = await riotApi.get(`/summoner/v4/summoners/by-name/${summonerName}`);
    const summonerId = summonerResponse.data.id;
    const rankResponse = await riotApi.get(`/league/v4/entries/by-summoner/${summonerId}`);
    res.json(rankResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;