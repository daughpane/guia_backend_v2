require("dotenv").config();
const express = require("express");
const path = require("path");
const pool = require("./config/database");
const AWS = require('aws-sdk');
const { checkAPI } = require("./middlewares/API");
const cors = require("cors");

const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Guia Backend V2");
});


function getPresignedUrls(key, expiresInSeconds = 86400) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: key,
    Expires: expiresInSeconds,
  };

  return s3.getSignedUrlPromise('getObject', params);
}

app.get("/api/artworks",checkAPI, async (req, res) => {
  try {
    const client = await pool.connect();
    const adminId = req.query.admin_id
    console.log(req.params)
    const result = await client.query(`
      SELECT 
        CAST(a.art_id AS INTEGER),
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
      WHERE ad.user_id = $1
      AND a.is_deleted = FALSE
      AND ai.is_thumbnail = TRUE
      ORDER BY a.art_id;
    `,[adminId]);

    const artworks = await Promise.all(result.rows.map(async (row) => {
      const presignedUrl = await getPresignedUrls(row.image_thumbnail);
      return { ...row, image_thumbnail: presignedUrl };
    }));
    
    res.send({artworks: artworks});
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error');
  }
});

const port = process.env.APP_PORT || 3001;

app.listen(port, () => {
  console.log("server "+port+" running");
});
