require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { writeSessionToSheet } = require('./sheetsClient');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '5mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/session', async (req, res) => {
  const { participant, taskTrials, interactionEvents } = req.body || {};

  if (!participant || !participant.participant_id) {
    return res.status(400).json({ error: 'Missing participant data' });
  }
  if (!Array.isArray(taskTrials) || !Array.isArray(interactionEvents)) {
    return res.status(400).json({ error: 'taskTrials and interactionEvents must be arrays' });
  }

  try {
    const result = await writeSessionToSheet({ participant, taskTrials, interactionEvents });
    console.log(`[${new Date().toISOString()}] Wrote session for ${participant.participant_id}:`, result);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Failed to write to Google Sheets:', err.message);
    res.status(500).json({ error: 'Failed to write to Google Sheets', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Research backend listening on http://localhost:${PORT}`);
  console.log(`Writing to spreadsheet ID: ${process.env.SPREADSHEET_ID || '(not set!)'}`);
});