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

app.get("/artworks",checkAPI, async (req, res) => {
  try {
    const client = await pool.connect();
    console.log(client)
    const result = await client.query(`
    SELECT *
    FROM guia_db_artwork AS a
    JOIN guia_db_section AS s ON a.section_id_id = s.section_id
    JOIN guia_db_museum AS m ON s.museum_id_id = m.museum_id
    LEFT JOIN guia_db_artworkimage AS ai ON a.art_id = ai.artwork_id
    WHERE m.museum_id = 1
    AND a.is_deleted = FALSE
    AND ai.is_thumbnail = TRUE
    ORDER BY a.art_id;
    `);

    const artworks = await Promise.all(result.rows.map(async (row) => {
      const presignedUrl = await getPresignedUrls(row.image_link);
      return { ...row, image_link: presignedUrl };
    }));
    
    res.send(artworks);
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
