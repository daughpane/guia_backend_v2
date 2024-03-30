const {
  getAllArtworkByAdminIdService,
  getArtworkByArtIdAdminIdService,
  getArtworkImagesByArtIdService
} = require("./artwork.service")
const { getPresignedUrls } = require("../../utils/amazon")


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
    res.status(500).send({detail: "Internal server error."});
  }
}

const getArtworkByArtIdAdminIdController = async(req, res, client) => {
  try {
    const { admin_id, art_id } = req.query;
    const artwork = await getArtworkByArtIdAdminIdService(client, art_id, admin_id)
    
    if (artwork.rowCount < 1) {
      res.status(400).send({detail: "Artwork does not exist."})
    }

    var images = await getArtworkImagesByArtIdService(client, art_id)

    images = await Promise.all(images.rows.map(async (row) => {
      const presignedUrl = await getPresignedUrls(row.image_link);
      return { is_thumbnail: row.is_thumbnail, image_link: presignedUrl };
    }));

    const result = {...artwork.rows[0], images: images}
    res.status(200).send({artwork: result})
  } catch (err) {
    console.log(err)
    res.status(500).send({detail: "Internal server error."});
  }
}

module.exports = {
  getAllArtworkByAdminIdController,
  getArtworkByArtIdAdminIdController
}