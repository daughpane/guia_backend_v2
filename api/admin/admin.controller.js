const { verifyPassword } = require("../../utils/password")


const { getAdminByUsername } = require("./admin.service")
const adminLoginController = async (req, res, client) => {
  try {
    const { admin_username, admin_password } = req.body
    var admin = await getAdminByUsername(client, admin_username)
    var match = verifyPassword(admin_password, admin.password)
    res.send({status: match})
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
}

module.exports = {
  adminLoginController
}