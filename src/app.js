const express = require('express');
const cors = require('cors');
const offerRoutes = require('./routes/offerRoutes');
const leadRoutes = require('./routes/leadRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/offer', offerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/score', scoreRoutes);

app.get('/', (req, res) => res.send('Lead Scoring Backend (structured) is up'));

// Alias for assignment spec: GET /results returns last scoring results
app.get('/results', (req, res) => {
  // Delegate to the same handler as GET /api/score
  require('./controllers/scoreController').getResults(req, res);
});

module.exports = app;
