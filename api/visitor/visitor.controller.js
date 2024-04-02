const { generateToken } = require("../../utils/token")
const { getArtworksPerSectionIdService } = require("../artwork/artwork.service")
const {
  getVisitorTokenService,
  getArtworkVisitsPerSectionIdService,
  validateSectionVisitedService,
  getTrafficPerMuseumIdService,
  getArtworkChecklistPerVisitorService } = require("./visitor.service")

const getVisitorTokenController = async (req, res, client) => {
  try {
    const { museum_id } = req.query 

    if (!museum_id) {
      return res.status(400).send({ detail: "Museum ID is required."})
    }

    let currentDate = new Date();

    // Get midnight of the next day
    let midnight = new Date(currentDate);
    midnight.setHours(24, 0, 0, 0);
    let expiresIn = Math.floor((midnight - currentDate) / 1000);

    const payload = {
      museum_id: museum_id,
      created_on: currentDate
    }

    var token = generateToken(payload, expiresIn)

    const saveToken = await getVisitorTokenService(client, token, museum_id)

    return res.status(200).send({visitor_token: token})
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({detail: "Internal server error."})
  }
}

const getArtworkVisitsPerSectionIdController = async (req, res, client) => {
  try {
    const { section_id, visitor_token } = req.query

    // check if the section exists in the museum the visitor is visiting
    const sectionExists = await validateSectionVisitedService(client, section_id, visitor_token)
    if(!sectionExists) {
      res.status(406).send({ detail: "Section does not exist in the museum that you are visiting." })
      return
    }

    // get artwork visits per section id
    const result = await getArtworkVisitsPerSectionIdService(client, section_id, visitor_token)

    const artworks = await getArtworksPerSectionIdService(client, section_id)

    return res.status(200).send({ visited: result, artworks: artworks.length })
  } catch(err) {
    console.error(err)
    return res.status(500).send({ detail: "Internal server error." })
  }
}

const getTrafficPerMuseumIdController = async (req, res, client) => {
  try {
    const { museum_id } = req.query
    if (!museum_id) {
      return res.status(400).send({detail: "Museum ID is required."})
    }
    const results = await getTrafficPerMuseumIdService(client, museum_id)
    return res.status(200).send({traffic:results.rows})
  } catch(err) {
    console.error(err)
    return res.status(500).send({ detail: "Internal server error." })
  }
}

const getArtworkChecklistPerVisitorController = async (req, res, client) => {
  try {
    const {visitor_token, section_id} = req.query
    if (!visitor_token) {
      return res.status(500).send({detail:"Visitor token is required."})
    }
    if (!section_id) {
      return res.status(500).send({detail:"Section ID is required."})
    }
    const checklist = await getArtworkChecklistPerVisitorService(client, visitor_token, section_id)
    return res.status(200).send({artwork_checklist: checklist.rows})
  } catch (err) {
    return res.status(500).send({detail:"Internal server error."})
  }
}
module.exports = {
  getVisitorTokenController,
  getArtworkVisitsPerSectionIdController,
  getTrafficPerMuseumIdController,
  getArtworkChecklistPerVisitorController
}