const {
  getAllArtworkByAdminIdService,
  createArtworkService,
  createArtworkImageService,
  getArtworkByArtIdAdminIdService,
  getArtworkImagesByArtIdService,
  findDuplicateArtworkService,
  findSectionWithAccessByUserId,
  editArtworkService,
  editArtworkImageService,
  getImageIDService
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

const editArtworkController = async (req, res, client) => {
  try {
    let artwork = req.body;

    //check if new images and thumbnail are provided
    const { images, thumbnail } = artwork;

    var duplicate = await findDuplicateArtworkService(client, artwork.title, artwork.artist_name, artwork.section_id)    
    let duplicateExists = false;
    for (let row of duplicate.rows) {
      if (row.art_id !== artwork.art_id) {
        duplicateExists = true;
        break;
      }
    }

    if (duplicate.rowCount > 0 && duplicateExists) {
      res.status(406).send({ detail: "Artwork with the same title and artist name already exists." });
      return;
    }

    var sections = await findSectionWithAccessByUserId(client, artwork.updated_by)
    if (!sections.rows.some(section => section.section_id == artwork.section_id)) {
      res.status(403).send({ detail: "Admin not allowed to edit artwork in this section." })
      return
    }
    
    //update artwork details
    const art_id = await editArtworkService(client, artwork);

    //update artwork images
    const imageIDs = await getImageIDService(client, art_id);

    imageIDs.map(async (id, idx) => {
      const result = await editArtworkImageService(client, images[idx], thumbnail, id.id)
    })

    return res.status(201).send({message: "Artwork edited successfully."})

  } catch(err) {
    console.error('Error execution query', err);
    res.status(500).send({detail: "Internal server error."});
  }
}

module.exports = {
  getAllArtworkByAdminIdController,
  createArtworkController,
  getArtworkByArtIdAdminIdController,
  editArtworkController
}