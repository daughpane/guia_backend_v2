const getVisitorTokenService = async (client, visitor_token, museum_id) => {
  var query = `
  INSERT INTO
    guia_db_visitor (visitor_token, museum_id_id, visited_on)
  VALUES ($1, $2, NOW());
  `
  return await client.query(query, [visitor_token, museum_id])
}

const getArtworkVisitsPerSectionIdService = async (client, section_id, visitor_token) => {
  // get visitor id
  var visitorIdQuery = await client.query(`SELECT visitor_id FROM guia_db_visitor WHERE visitor_token = $1`, [visitor_token]);
  let visitor_id = visitorIdQuery.rows[0].visitor_id;

  // get artworks per section per visitor id
  var visitQuery = `
    SELECT COUNT(*)
    FROM guia_db_artwork artwork
    LEFT JOIN guia_db_artworkvisits visits
    ON artwork.art_id = visits.art_id_id
    WHERE visits.visitor_id_id = $1 
    AND artwork.section_id_id = $2
    GROUP BY artwork.art_id
  `;

  const result = await client.query(visitQuery, [visitor_id, section_id]);
  return result.rowCount;
}

const validateSectionVisitedService = async (client, section_id, visitor_token) => {
  let query = `
    SELECT section_id
    FROM guia_db_section section
    LEFT JOIN guia_db_visitor visitor
    ON section.museum_id_id = visitor.museum_id_id
    WHERE visitor.visitor_token = $1
    AND section.section_id = $2
  `;

  const result = await client.query(query, [visitor_token, section_id])

  if(result.rowCount === 1 && result.rows[0].section_id === section_id) {
    return true
  } else {
    return false
  }
}

const getTrafficPerMuseumIdService = async (client, museum_id) => {
  let query = `
    SELECT 
        section.section_id,
        COALESCE(COUNT(visits.visit_id), 0) AS total_visits
    FROM 
        guia_db_section section 
    LEFT JOIN
        guia_db_artwork artwork ON artwork.section_id_id = section.section_id
    LEFT JOIN 
        (SELECT * FROM guia_db_artworkvisits WHERE DATE(art_visited_on) = CURRENT_DATE) visits 
        ON visits.art_id_id = artwork.art_id 
    WHERE 
        section.museum_id_id = $1
    GROUP BY
        section.section_id;
  `
  return await client.query(query, [museum_id])
}
const getArtworkChecklistPerVisitorService = async (client, visitor_token, section_id) => {
  let query = `
  SELECT 
    artwork.art_id,
    artwork.title,
    artwork.artist_name,
    artwork.date_published,
    visit_info.visit_id,
    visit_info.is_visited,
    visit_info.visit_type
  FROM guia_db_artwork artwork 
  LEFT JOIN
    (
      SELECT 
        visits.visit_id,
          visits.art_id_id,
        visits.visit_type,
        visits.is_visited,
        visits.art_visited_on 
      FROM guia_db_artworkvisits visits
      WHERE visits.visitor_id_id IN (
        SELECT visitor_id  
        FROM guia_db_visitor 
        WHERE visitor_token = $1
      )
      and DATE(visits.art_visited_on) = current_date 
    ) visit_info
    on visit_info.art_id_id = artwork.art_id 
  WHERE
    artwork.section_id_id = $2
    AND artwork.is_deleted = FALSE
  ORDER BY artwork.art_id 
  `
  return await client.query(query, [visitor_token, section_id])
}

const addNewVisitService = async (client, visitor_id, art_id, visit_type) => {
  let query = `
  INSERT INTO
    guia_db_artworkvisits (visit_type, art_id_id , visitor_id_id, art_visited_on, is_deleted)
  VALUES ($1, $2, $3, NOW(), FALSE)
   RETURNING visit_id
  `
  return await client.query(query, [visit_type, art_id, visitor_id])
}

const getVisitorIdByTokenService = async (client, visitor_token) => {
  let query = `
  SELECT *  
  FROM guia_db_visitor visitor
  WHERE visitor.visitor_token = $1
  `
  return await client.query(query, [visitor_token])
}

const checkDuplicateArtworkVisit = async (client, visitor_id, art_id) => {
  let query = `
  SELECT *
  FROM guia_db_artworkvisits visits
  WHERE visits.visitor_id_id = $1
  AND DATE(visits.art_visited_on) = current_date 
  AND visits.art_id_id = $2
  `
  return await client.query(query, [visitor_id, art_id])
}

const editVisitService = async (client, visit_id, is_deleted) => {
  let query = `
    UPDATE guia_db_artworkvisits
    SET is_deleted = $2, updated_on = NOW()
    WHERE visit_id = $1;
  `
  return await client.query(query, [visit_id, is_deleted])
}

module.exports = {
  getVisitorTokenService,
  getArtworkVisitsPerSectionIdService,
  validateSectionVisitedService,
  getTrafficPerMuseumIdService,
  getArtworkChecklistPerVisitorService,
  getVisitorIdByTokenService,
  addNewVisitService,
  checkDuplicateArtworkVisit,
  editVisitService
}