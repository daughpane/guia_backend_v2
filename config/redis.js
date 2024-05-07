const { createClient } = require('redis');

const redisClient = createClient(
  {
    // password: 'c5mqD6NCLgsmTe00f7FPV92BFuMxdd6q',
    // socket: {
    //     host: 'redis-16104.c251.east-us-mz.azure.redns.redis-cloud.com',
    //     port: 16104
    // }
    url:"redis://default:c5mqD6NCLgsmTe00f7FPV92BFuMxdd6q@redis-16104.c251.east-us-mz.azure.redns.redis-cloud.com:16104"
  }
);


module.exports = {
  redisClient
};