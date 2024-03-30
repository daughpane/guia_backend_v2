
const getSectionService = async (client, museum_id_id, section_id) => {
    let query = `
    SELECT
     section_id,
     section_name,
     museum_id_id as museum_id
    FROM guia_db_section
    WHERE museum_id_id = $1`

    if (section_id) {
        query += ` AND section_id = $2`
    }

    query += ` ORDER BY section_id ASC`

    return await client.query(query, section_id ? [museum_id_id, section_id]:[museum_id_id])
}

module.exports = {
    getSectionService
}