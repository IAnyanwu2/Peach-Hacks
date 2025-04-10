import { useState } from 'react';

const TournamentManager = () => {
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentUrl, setTournamentUrl] = useState('');
  const [participantName, setParticipantName] = useState('');

  const createTournament = async () => {
    const res = await fetch('/tournament/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: tournamentName,
        url: tournamentUrl,
      }),
    });

    const data = await res.json();
    console.log('Tournament Created:', data);
  };

  const addParticipant = async () => {
    const res = await fetch('/tournament/add-participant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournamentUrl,
        participantName,
      }),
    });

    const data = await res.json();
    console.log('Participant Added:', data);
  };

  const startTournament = async () => {
    const res = await fetch('/tournament/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentUrl }),
    });

    const data = await res.json();
    console.log('Tournament Started:', data);
  };

  return (
    <div className="p-4 border mt-8 rounded shadow">
      <h2 className="text-xl font-bold">🏆 Tournament Manager</h2>

      <input
        placeholder="Tournament Name"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
        className="block p-2 mt-2 border"
      />
      <input
        placeholder="Tournament URL (must be unique)"
        value={tournamentUrl}
        onChange={(e) => setTournamentUrl(e.target.value)}
        className="block p-2 mt-2 border"
      />
      <button onClick={createTournament} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
        Create Tournament
      </button>

      <input
        placeholder="Participant Name"
        value={participantName}
        onChange={(e) => setParticipantName(e.target.value)}
        className="block p-2 mt-4 border"
      />
      <button onClick={addParticipant} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        Add Participant
      </button>

      <button onClick={startTournament} className="bg-purple-600 text-white px-4 py-2 mt-4 rounded">
        Start Tournament
      </button>
    </div>
  );
};

export default TournamentManager;