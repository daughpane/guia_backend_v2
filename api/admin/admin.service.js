const getAdminByUsername = async (client, admin_username) => {
  let query = `
    SELECT *
    FROM auth_user AS users
    JOIN guia_db_admin AS admin ON users.id = admin.user_id
    where users.username = $1;
  `
  let result =  await client.query(query, [admin_username])
  return result
}

const getAdminById = async (client, admin_id) => {
  let query = `
    SELECT *
    FROM auth_user AS users
    JOIN guia_db_admin AS admin ON users.id = admin.user_id
    WHERE admin.user_id = $1;
  `
  let result =  await client.query(query, [admin_id])
  return result
}

const adminChangePasswordService = async (client, admin_id, password) => {
  const query = `
  UPDATE auth_user
  SET password = $1
  WHERE id = $2;
  `

  let result = await client.query(query, [password, admin_id])
  return result
}

module.exports = {
  getAdminByUsername,
  getAdminById,
  adminChangePasswordService
}
