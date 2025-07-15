const  {Liveblocks} = require("@liveblocks/node");

const client = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

module.exports = client;