const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.CHALLONGE_API_KEY;
const BASE_URL = 'https://api.challonge.com/v1';

const createTournament = async (req, res) => {
  try {
    const { name, url } = req.body;

    const response = await axios.post(`${BASE_URL}/tournaments.json`, {
      api_key: API_KEY,
      tournament: {
        name,
        url,
        tournament_type: 'single elimination',
      },
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Create Tournament Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

const addParticipant = async (req, res) => {
  try {
    const { tournamentUrl, participantName } = req.body;

    const response = await axios.post(
      `${BASE_URL}/tournaments/${tournamentUrl}/participants.json`,
      {
        api_key: API_KEY,
        participant: {
          name: participantName,
        },
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Add Participant Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

const startTournament = async (req, res) => {
  try {
    const { tournamentUrl } = req.body;

    const response = await axios.post(
      `${BASE_URL}/tournaments/${tournamentUrl}/start.json`,
      {
        api_key: API_KEY,
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Start Tournament Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTournament,
  addParticipant,
  startTournament,
};