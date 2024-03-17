/*
* TODO: Add more error handling
 */
const getAllArtworkByAdminIdService = async (client, admin_id) => {
  const query = await client.query(`
      SELECT 
        CAST(a.art_id AS INTEGER),
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
      WHERE ad.user_id = $1
      AND a.is_deleted = FALSE
      AND ai.is_thumbnail = TRUE
      ORDER BY a.art_id;
    `, [admin_id]);
  
  return query
}

module.exports = {
  getAllArtworkByAdminIdService
}