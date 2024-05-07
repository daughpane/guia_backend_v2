const {checkCache} = require("../../middlewares/checkCache")

const getAllArtworkCache = async (req, res, next) => {
  const { admin_id } = req.query;
  console.log("getArtworkCache "+admin_id)
  try {
    var hit = await checkCache(admin_id)
    if(hit){
      return res.status(201).send(hit);
    } else next()
  } catch(e) {
    console.error(e)
  } 
}

const getArtworkCache = async (req, res, next) => {
  const { art_id } = req.query;
  try {
    var hit = await checkCache(art_id)
    if(hit){
      return res.status(200).send(hit);
    } else next()
  } catch(e) {
    console.error(e)
  } 
}

module.exports = {
  getAllArtworkCache,
  getArtworkCache
}