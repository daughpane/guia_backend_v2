const { pool } = require("../config/database")

const connectDatabase = (handler) => async (req, res) => {
  const client = await pool.connect();
  try {
    // Pass the client connection to the handler
    await handler(req, res, client);
  } finally {
    // Release the client connection back to the pool
    client.release();
  }
};

module.exports = {
  connectDatabase
};
