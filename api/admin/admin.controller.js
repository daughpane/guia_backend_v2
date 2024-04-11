const { verifyPassword, hashPassword } = require("../../utils/password")
const { generateToken, getTokenExpiry } = require("../../utils/token")
const { getAdminByUsername, getAdminById, adminChangePasswordService } = require("./admin.service")

const adminLoginController = async (req, res, client) => {
  try {
    const { admin_username, admin_password } = req.body
    
    var admin = await getAdminByUsername(client, admin_username)

    if (admin.rowCount < 1) {
      return res.status(401).send({ detail: "User does not exist." })
    }

    admin = admin.rows[0]

    var match = verifyPassword(admin_password, admin.password)
    
    if (!match) {
      return res.status(401).send({detail: "Invalid login credentials." })
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
      return res.status(500).send({
        detail: "Internal server error.",
        dev_message: err
      });
    }

    return res.status(200).send(adminInfo)
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      detail: "Internal server error.",
      dev_message: "Query error."
    });
  }
}

const adminChangePasswordController = async (req, res, client) => {
  try {
    const { admin_id, old_password, new_password } = req.body;

    if (req.admin_id != admin_id) {
      return res.status(401).send({detail: "Logged in user does not have permission to change this account's password."})
    }

    var admin = await getAdminById(client, admin_id)

    if (admin.rowCount < 1) {
      return res.status(401).send({ detail: "User does not exist." })
    }

    admin = admin.rows[0];

    var match = verifyPassword(old_password, admin.password);

    if (!match) {
      return res.status(401).send({ detail: "Incorrect current password." })
    }

    if (old_password == new_password) {
      return res.status(401).send({ detail: "Password has already been used." })
    }

    const hash = hashPassword(new_password);

    const result = await adminChangePasswordService(client, admin.user_id, hash)

    if (result.rowCount != 0) {
      return res.status(200).send({ message: 'Password changed successfully.' })
    } else {
      return res.status(400).send({ detail: 'Cannot change password.' })
    }
    
  }
  catch (err) {
    console.error('Error executing query', err);
    return res.status(500).send({ detail: 'Internal server error.' });
  }
}

module.exports = {
  adminLoginController,
  adminChangePasswordController
}