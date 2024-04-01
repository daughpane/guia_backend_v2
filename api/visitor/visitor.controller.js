const { generateToken } = require("../../utils/token")
const { getVisitorTokenService } = require("./visitor.service")

const getVisitorTokenController = async (req, res, client) => {
  try {
    const { museum_id } = req.body 

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

    return res.status(500).send({visitor_token: token})
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({detail: "Internal server error."})
  }
}

module.exports = {
  getVisitorTokenController
}