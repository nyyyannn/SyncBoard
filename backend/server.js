require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth-route');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


