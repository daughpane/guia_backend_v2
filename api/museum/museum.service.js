const getMuseumService = async (client, museum_id) => {
    let query = `
    SELECT *
    FROM guia_db_museum`

    if (museum_id) {
        query += ` WHERE museum_id = $1`
    }

    query += ` ORDER BY museum_id ASC`

    return await client.query(query, museum_id ? [museum_id] : [])
}

module.exports = {
    getMuseumService
}