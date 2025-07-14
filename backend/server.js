require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const connectDB = require('./config/db');
const errorMiddleware = require('./utils/error-middleware');
const liveblocksRoutes = require('./routes/liveblocks-route');
const authRoutes = require('./routes/auth-route');
const docsRoutes = require('./routes/docs-route');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

app.use('/api/docs', docsRoutes);

app.use('/api/liveblocks', liveblocksRoutes);

// Error handling middleware
app.use(errorMiddleware);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


