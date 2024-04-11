const getArtworkImagesPerArtIdService = async (client) => {
  let query = `
    SELECT
        artwork.art_id AS art_id,
        json_agg(image.image_link) AS image_links
    FROM
        guia_db_artwork artwork
    LEFT JOIN
        guia_db_artworkimage  image ON artwork.art_id = image.artwork_id
    WHERE artwork.is_deleted = false AND image.is_deleted = false
    GROUP BY
        artwork.art_id
  `
  return await client.query(query, [])
}

module.exports = {
  getArtworkImagesPerArtIdService
}