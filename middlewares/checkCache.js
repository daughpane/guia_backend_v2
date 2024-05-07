const {redisClient} = require("../config/redis")

const checkCache = async (key) => {
  try {
    console.log("checkCache")
    const client = await redisClient
      .on('error', err => console.log('Redis Client Error', err))
      .on('ready', () => {
        console.log('Redis Client Connected Successfully');
      })
      .connect();
    const value = await client.get(key);
    await client.disconnect();
    return JSON.parse(value)
  } catch(e) {
    throw new Error("Redis Error: " + e)
  }
}

const setCache = async (key, value) => {
  try {
    console.log("setCache")
    const client = await redisClient
      .on('error', err => console.log('Redis Client Error', err))
      .on('ready', () => {
        console.log('Redis Client Connected Successfully');
      })
      .connect();

    await client.set(key, JSON.stringify(value));
    await client.disconnect();
  } catch (e) {
    console.log(e)
    // throw new Error("Redis Error: " + e)
  }
}

module.exports = {
  checkCache,
  setCache
}