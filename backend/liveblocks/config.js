const { createClient } = require("@liveblocks/node");

const client = createClient({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

module.exports = client;