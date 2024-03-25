const { getAllArtworkByAdminIdService, createArtworkService, createArtworkImageService } = require("./artwork.service")
const { getPresignedUrls } = require("../../utils/amazon")
const { sortObject } = require("../../utils/functions");


/*
* TODO: create more error handling
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
    res.status(500).send(err);
  }
}

const createArtworkController = async (req, res, client) => {
  try {
    let artwork = req.body;

    const images = artwork.images;
    const thumbnail = artwork.thumbnail;

    // modify artwork contents
    delete artwork.images;
    delete artwork.thumbnail;
    artwork.date = new Date(); // for the added_on column

    // sort keys alphabetically
    artwork = sortObject(artwork);

    const art_id = await createArtworkService(client, artwork);

    const imageResult = await createArtworkImageService(client, images, thumbnail, art_id);

    // if successful adding 10 images to table artworkimage, send success code
    if(imageResult) {
      res.send({ artwork: art_id });
    } else {
      throw new Error('Error adding all the images');
    }
  } catch(err) {
    console.error('Error execution query', err);
    res.status(500).send('Error');
  }
}

module.exports = {
  getAllArtworkByAdminIdController,
  createArtworkController
}