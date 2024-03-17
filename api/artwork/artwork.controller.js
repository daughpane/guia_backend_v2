const { getAllArtworkByAdminIdService } = require("./artwork.service")
const { getPresignedUrls } = require("../../utils/amazon")


/*
* TODO: Add more error handling
 */
const getAllArtworkByAdminIdController = async (req, res, client) => {
  try {
    const { admin_id } = req.query;

    const result  = await getAllArtworkByAdminIdService(client, admin_id)

    const artworks = await Promise.all(result.rows.map(async (row) => {
      const presignedUrl = await getPresignedUrls(row.image_thumbnail);
      return { ...row, image_thumbnail: presignedUrl };
    }));
    
    res.send({artworks: artworks});
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
}

module.exports = {
  getAllArtworkByAdminIdController
}