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

const getArtworksPerSectionIdService = async (client, section_id) => {
  var query = `
    SELECT *
    FROM guia_db_artwork
    WHERE section_id_id = $1
    AND is_deleted = FALSE
  `;

  const result = await client.query(query, [section_id]);
  return result.rows;
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


/* Create Artwork Services */

// add new row to guia_db_artwork
const createArtworkService = async (client, artwork) => {

  // query for artwork table
  let query = `INSERT INTO guia_db_artwork
  VALUES (DEFAULT, $12, $3, $10, $5, $9, $8, `;

  if(artwork.dimen_height_cm) {
    query += `$7`;
  } else {
    query += `NULL`;
  }

  query += `, $6, `;

  if(artwork.additional_info) {
    query += `$2`;
  } else {
    query += `NULL`;
  }

  query += `, $4, NULL, false, $1, $11, NULL) RETURNING art_id;`;
  
  let result = await client.query(query, Object.values(artwork));
  return result.rows[0].art_id;
}

// add new row to guia_db_artworkimage
const createArtworkImageService = async (client, images, thumbnail, art_id) => {
  let i = 0;
  for (; i < images.length; i++) {
    
    let query = `INSERT INTO guia_db_artworkimage
    VALUES (DEFAULT, ' ', $1, `;

    if(images[i] === thumbnail) {
      query += `true, `;
    } else {
      query += `false, `;
    }

    query += `false, $2);`;

    await client.query(query, [images[i], art_id]);
  } 

  if(i === images.length) {
    return true;
  } else {
    return false;
  } 
}

/**
 * 
 * @param {*} client 
 * @param {string} title 
 * @param {string} artist_name 
 * @param {int} section_id 
 * @returns list of artwork with matching title, artist name, and section id
 * @description Used for checking if there is artwork already exists
 */
const findDuplicateArtworkService = async (client, title, artist_name, section_id) => {
  let query = `
    SELECT artwork.art_id 
    FROM guia_db_artwork as artwork
    WHERE 
        LOWER(artwork.title) = LOWER($1) 
        AND LOWER(artwork.artist_name) = LOWER($2) 
        AND artwork.is_deleted = FALSE 
        AND artwork.section_id_id IN (
            SELECT s.section_id 
        FROM guia_db_section as s
        INNER JOIN guia_db_section s2 ON s.museum_id_id = s2.museum_id_id
        WHERE s2.section_id = $3
        )
  `
  return client.query(query, [title, artist_name, section_id])   
}

/**
 * @param {*} client 
 * @param {*} admin_id 
 * @description Returns sections that an admin has access to
 */
const findSectionWithAccessByUserId = async (client, admin_id) => {
  let query = `
    SELECT
      admin.user_id,
      section.section_id
    FROM guia_db_admin AS admin
    LEFT JOIN guia_db_section AS section
      ON admin.museum_id_id = section.museum_id_id
    WHERE admin.user_id = $1
  `

  return client.query(query, [admin_id])
}

const deleteArtworkService = async (client, art_id) => {
  //art_id if artwork
  const query = await client.query(`
    UPDATE guia_db_artwork
    SET is_deleted = TRUE
    WHERE art_id = $1
  `, [art_id]);

  return query
}

const deleteArtworkImageService = async (client, art_id) => {
  //artwork_id if artworkimage
  const query = await client.query(`
    UPDATE guia_db_artworkimage
    SET is_deleted = TRUE
    WHERE artwork_id = $1 AND is_deleted = FALSE
  `, [art_id]);

  return query
}

/* Edit Artwork Services */
const editArtworkService = async (client, artwork) => {
  let query = `
    UPDATE guia_db_artwork
    SET 
      title = $1,
      artist_name = $2,
      medium = $3,
      date_published = $4,
      dimen_width_cm = $5,
      dimen_height_cm = $6,
      dimen_length_cm = $7,
      description = $8,
      additional_info = $9,
      updated_by_id = $10,
      section_id_id = $11
    WHERE 
      art_id = $12
    RETURNING art_id;
  `;

  let result = await client.query(query, [
    artwork.title,
    artwork.artist_name,
    artwork.medium,
    artwork.date_published,
    artwork.dimen_width_cm,
    artwork.dimen_height_cm || null,
    artwork.dimen_length_cm,
    artwork.description,
    artwork.additional_info,
    artwork.updated_by,
    artwork.section_id,
    artwork.art_id,
  ]);

  return result.rows[0].art_id;
}

const getImageIDService = async(client, art_id) => {
  let query = `
    SELECT id FROM guia_db_artworkimage
    WHERE
      artwork_id = $1`;

  const result = await client.query(query, [
    art_id,
  ]);

  return result.rows;
}

const editArtworkImageService = async(client, image, thumbnail, id) => {
  let query = `
  UPDATE guia_db_artworkimage
  SET
    image_link = $1,
    is_thumbnail = $2
  WHERE
    id = $3`;

  await client.query(query, [
    image,
    thumbnail === image,
    id,
  ]);

  return true;
}


module.exports = {
  getAllArtworkByAdminIdService,
  getArtworkByArtIdAdminIdService,
  getArtworksPerSectionIdService,
  getArtworkImagesByArtIdService,
  createArtworkService,
  createArtworkImageService,
  findDuplicateArtworkService,
  findSectionWithAccessByUserId,
  deleteArtworkService,
  deleteArtworkImageService,
  editArtworkService,
  editArtworkImageService,
  getImageIDService,
}