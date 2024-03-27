const { verifyPassword } = require("../../utils/password")
const { generateToken, getTokenExpiry } = require("../../utils/token")

const { getAdminByUsername } = require("./admin.service")
const adminLoginController = async (req, res, client) => {
  try {
    const { admin_username, admin_password } = req.body
    
    var admin = await getAdminByUsername(client, admin_username)

    if (admin.rowCount < 1) {
      res.status(401).send({detail: "Admin does not exist"})
    }

    admin = admin.rows[0]

    var match = verifyPassword(admin_password, admin.password)
    
    if (!match) {
      res.status(401).send({detail: "Invalid login credentials."})
    }

    var adminInfo = {
      admin_id: admin.user_id,
      museum_id: admin.museum_id_id
    }

    var token = generateToken(adminInfo)
    adminInfo.token = token

    try {
      adminInfo.token_expires = getTokenExpiry(token)
    } catch (err) {
      res.status(500).send({
        detail: "Internal server error.",
        dev_message: err
      });
    }

    res.send(adminInfo)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      detail: "Internal server error.",
      dev_message: "Query error."
    });
  }
}

module.exports = {
  adminLoginController
}