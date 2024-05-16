const {
  getAllArtworkByAdminIdService,
  createArtworkService,
  createArtworkImageService,
  getArtworkByArtIdAdminIdService,
  getArtworkImagesByArtIdService,
  findDuplicateArtworkService,
  findSectionWithAccessByUserId,
  deleteArtworkService,
  deleteArtworkImageService,
  editArtworkService,
  editArtworkImageService,
  getImageIDService
} = require("./artwork.service")
const { getPresignedUrls } = require("../../utils/amazon")
const { sortObject } = require("../../utils/functions");
const fs = require('fs');

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
    
    return res.status(201).send({artworks: artworks});
  } catch (err) {
    return res.status(500).send({detail: "Internal server error."});
  }
}

const getArtworkByArtIdAdminIdController = async (req, res, client) => {
  try {
    const { admin_id, art_id } = req.query;
    const artwork = await getArtworkByArtIdAdminIdService(client, art_id, admin_id)
    
    if (artwork.rowCount < 1) {
      return res.status(400).send({ detail: "Artwork does not exist." })
    }

    var images = await getArtworkImagesByArtIdService(client, art_id)

    images = await Promise.all(images.rows.map(async (row) => {
      const presignedUrl = await getPresignedUrls(row.image_link);
      return { is_thumbnail: row.is_thumbnail, image_link: presignedUrl };
    }));

    const result = { ...artwork.rows[0], images: images }
    return res.status(200).send({ artwork: result })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ detail: "Internal server error." });
  }
}

const createArtworkController = async (req, res, client) => {
  try {
    let artwork = req.body;

    if (req.admin_id != artwork.added_by) {
      return res.status(401).send({detail: "Admin does not have access to this action.", dev_message:"Admin ID and Added by do not match."})
    }

    // error handling
    var duplicate = await findDuplicateArtworkService(client, artwork.title, artwork.artist_name, artwork.section_id)
    if (duplicate.rowCount > 0) {
      return res.status(406).send({ detail: "Artwork with the same title and artist name already exists." })
    }

    var sections = await findSectionWithAccessByUserId(client, artwork.added_by)
    if (!sections.rows.some(section => section.section_id == artwork.section_id)) {
      return res.status(403).send({ detail: "Admin not allowed to add artwork in this section." })
    }

    // isolate thumbnail and images
    const images = artwork.images;
    const thumbnail = artwork.thumbnail;

    // modify artwork contents
    delete artwork.images;
    delete artwork.thumbnail;

    // sort keys alphabetically
    artwork = sortObject(artwork);

    const art_id = await createArtworkService(client,
      artwork.added_by,
      artwork.additional_info,
      artwork.artist_name,
      artwork.date_published,
      artwork.description,
      artwork.dimen_height_cm,
      artwork.dimen_length_cm,
      artwork.dimen_width_cm,
      artwork.medium,
      artwork.section_id,
      artwork.title
    );

    const imageResult = await createArtworkImageService(client, images, thumbnail, art_id);

    // if successful adding 10 images to table artworkimage, send success code
    if(imageResult) {
      return res.status(200).send({ artwork_id: art_id });
    } else {
      return res.status(400).send({ detail: "Error creating artwork." })
    }
  } catch(err) {
    console.error('Error execution query', err);
    return res.status(500).send({ detail: "Internal server error." });
  }
}

const deleteArtworkController = async (req, res, client) => {
  try {
    const { art_id } = req.body;
    const updated_by = req.admin_id
    if (!art_id) {
      return res.status(400).send({detail:"Artwork ID is required."})
    }

    const artwork = await getArtworkByArtIdAdminIdService(client, art_id, updated_by)
    
    if (artwork.rowCount < 1) {
      return res.status(400).send({detail: "Artwork does not exist."})
    } 

    const result = await deleteArtworkService(client, art_id, updated_by);
    const image = await deleteArtworkImageService(client, art_id);

    return res.status(200).send({message: "Artwork deleted successfully."});
  } catch (err) {
    console.error('Error executing query', err);
    return res.status(500).send({detail: "Internal server error."});
  }
}

const editArtworkController = async (req, res, client) => {
  try {
    let artwork = req.body;

    if (req.admin_id != artwork.updated_by) {
      return res.status(401).send({detail: "Admin does not have access to this action.", dev_message:"Admin ID and Updated by do not match."})
    }


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
    return res.status(500).send({detail: "Internal server error."});
  }
}

const predictArtworkController = async (req, res, client) => {
  // const image = new Image("api/artwork/test-picture.jpg");

  // const context = image.getContext('2d');
        
  // context.drawImage(videoElement, 0, 0, 224, 224);
  // const img = image.toDataURL('image/jpeg');

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer jbv3mXKaXYSiKBADR6gI4v8qOAseSJYi");
  myHeaders.append("Content-Type", "multipart/form-data");

  const formdata = new FormData();
  formdata.append("image", fs.createReadStream('api/artwork/test-picture.jpg'));
  console.log(formdata)
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };
  fetch("https://guia-endpoint.southeastasia.inference.ml.azure.com/score", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result)
      res.status(200).send("Working so far");
    })
    .catch((error) => console.error(error));

}

module.exports = {
  getAllArtworkByAdminIdController,
  createArtworkController,
  getArtworkByArtIdAdminIdController,
  editArtworkController,
  deleteArtworkController,
  predictArtworkController
}