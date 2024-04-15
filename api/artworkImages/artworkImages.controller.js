const { getPresignedUrls } = require("../../utils/amazon");
const { getArtworkImagesPerArtIdService } = require("./artworkImages.service")

const getArtworkImagesPerArtIdController = async (req, res, client) => {
  try {
    const artworkImages = await getArtworkImagesPerArtIdService(client)
    const updatedArtworkImages = await Promise.all(artworkImages.rows.map(async (row) => {
      const presignedUrls = await Promise.all (row.image_links.map(async (links) => {
        return await getPresignedUrls(links)
      }))
      return {...row, image_links: presignedUrls}
    }));
    return res.status(200).send({artwork_images: updatedArtworkImages})
  } catch (err) {
    console.log(err)
    return res.status(500).send({detail: "Internal server error."})
  }
}

module.exports = {
  getArtworkImagesPerArtIdController
}