const getVisitorTokenService = async (client, visitor_token, museum_id) => {
  var query = `
  INSERT INTO
    guia_db_visitor (visitor_token, museum_id_id, visited_on)
  VALUES ($1, $2, NOW());
  `
  return await client.query(query, [visitor_token, museum_id])
}

module.exports = {
  getVisitorTokenService
}