const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//this is only a test endpoint which will be used removed later
app.get('/ping', (req, res) => {
  res.send('pong 🏓');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


