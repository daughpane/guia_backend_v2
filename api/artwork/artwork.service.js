/*
* TODO: Add more error handling
 */
const getAllArtworkByAdminIdService = async (client, admin_id) => {
  var query = `
      SELECT DISTINCT
        CAST(a.art_id AS INTEGER) as art_id,
        a.title, 
        a.artist_name, 
        a.medium, 
        a.date_published, 
        a.dimen_width_cm, 
        a.dimen_length_cm, 
        a.dimen_height_cm, 
        a.description, 
        a.additional_info, 
        a.added_on, 
        a.updated_on, 
        a.is_deleted, 
        s.section_id, 
        a.added_by_id as added_by, 
        a.updated_by_id as updated_by, 
        ai.image_link as image_thumbnail
      FROM guia_db_artwork AS a
      JOIN guia_db_section AS s ON a.section_id_id = s.section_id
      LEFT JOIN guia_db_admin AS ad ON ad.museum_id_id = s.museum_id_id
      LEFT JOIN guia_db_artworkimage AS ai ON a.art_id = ai.artwork_id
      WHERE a.is_deleted = FALSE
      AND ai.is_thumbnail = TRUE
    `
  if (admin_id) {
    query += ` AND ad.user_id = $1`
  }
  
  query += ` ORDER BY art_id;`

  return await client.query(query, admin_id ? [admin_id]: [])
}

const getArtworkByArtIdAdminIdService = async (client, art_id, admin_id) => {
  var query = `
      SELECT 
        CAST(art.art_id AS INTEGER),
        art.title, 
        art.artist_name, 
        art.medium, 
        art.date_published, 
        art.dimen_width_cm, 
        art.dimen_length_cm, 
        art.dimen_height_cm, 
        art.description, 
        art.additional_info, 
        art.added_on, 
        art.updated_on, 
        art.is_deleted, 
        section.section_id, 
        art.added_by_id as added_by, 
        art.updated_by_id as updated_by
      FROM guia_db_artwork AS art
      JOIN guia_db_section AS section ON art.section_id_id = section.section_id
      LEFT JOIN guia_db_admin AS admin ON admin.museum_id_id = section.museum_id_id
      WHERE art.art_id = $1
      AND art.is_deleted = FALSE
    `
  if (admin_id) {
    query+= ` AND admin.user_id = $2`
  }

  query += ` LIMIT 1;`
  
  return await client.query(query, admin_id ? [art_id, admin_id] : [art_id]);
}

/**
 * 
 * @param {*} client 
 * @param {int} art_id optional
 */
const getArtworkImagesByArtIdService = async (client, art_id) => {
  var query = `
    SELECT
      image_link,
      is_thumbnail,
      artwork_id as art_id
    FROM guia_db_artworkimage 
    WHERE is_deleted = FALSE
  `
  if (art_id) {
    query += ` AND artwork_id = $1;`
  }

  return await client.query(query, art_id ? [art_id]: [])
}


module.exports = {
  getAllArtworkByAdminIdService,
  getArtworkByArtIdAdminIdService,
  getArtworkImagesByArtIdService
}