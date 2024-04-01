const {
  getAllArtworkByAdminIdService,
  createArtworkService,
  createArtworkImageService,
  getArtworkByArtIdAdminIdService,
  getArtworkImagesByArtIdService,
  findDuplicateArtworkService,
  findSectionWithAccessByUserId,
  deleteArtworkService,
  deleteArtworkImageService
} = require("./artwork.service")
const { getPresignedUrls } = require("../../utils/amazon")
const { sortObject } = require("../../utils/functions");


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

const deleteArtworkController = async (req, res, client) => {
  try {
    const { art_id } = req.body;
    
    if (!art_id) {
      return res.status(400).send({detail:"Artwork ID is required."})
    }

    const artwork = await getArtworkByArtIdAdminIdService(client, art_id)

    if (artwork.rowCount < 1) {
      return res.status(400).send({detail: "Artwork does not exist."})
    } 

    const result = await deleteArtworkService(client, art_id);
    const image = await deleteArtworkImageService(client, art_id);

    return res.status(200).send({message: "Artwork deleted successfully."});
  } catch (err) {
    console.error('Error executing query', err);
    return res.status(500).send({detail: "Internal server error."});
  }
}

const editArtworkController = async (req, res, client) => {
  try {
    var { title, artist_name, section_id, updated_by } = req.body;
    
    var duplicate = await findDuplicateArtworkService(client, title, artist_name, section_id)
    if (duplicate.rowCount > 0) {
      res.status(406).send({ detail: "Artwork with the same title and artist name already exists." })
      return
    }

    var sections = await findSectionWithAccessByUserId(client, updated_by)
    if (!sections.rows.some(section => section.section_id == section_id)) {
      res.status(403).send({ detail: "Admin not allowed to edit artwork in this section." })
      return
    }
    
    res.status(200).send("yeah")
  } catch(err) {
    console.error('Error execution query', err);
    res.status(500).send({detail: "Internal server error."});
  }
}
module.exports = {
  getAllArtworkByAdminIdController,
  createArtworkController,
  getArtworkByArtIdAdminIdController,
  editArtworkController,
  deleteArtworkController
}