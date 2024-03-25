const getAdminByUsername = async (client, admin_username) => {
  let query = `
    SELECT *
    FROM auth_user AS users
    JOIN guia_db_admin AS admin ON users.id = admin.user_id
    where users.username = $1;
  `
  let result =  await client.query(query, [admin_username])
  return result.rows[0]
}


module.exports = {
  getAdminByUsername
}