import axios from 'axios';

// Access the API key from environment variables
const API_KEY = process.env.VITE_APP_API_KEY;  // Access the API key loaded by dotenv

const BASE_URL = 'https://api.challonge.com/v1';

export const createTournament = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};

export const addParticipant = async (req, res) => {
  try {
    const { tournamentUrl, participantName } = req.body;

    const response = await axios.post(`${BASE_URL}/tournaments/${tournamentUrl}/participants.json`, {
      api_key: API_KEY,
      participant: {
        name: participantName,
      },
    });

    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const startTournament = async (req, res) => {
  try {
    const { tournamentUrl } = req.body;

    const response = await axios.post(`${BASE_URL}/tournaments/${tournamentUrl}/start.json`, {
      api_key: API_KEY,
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};