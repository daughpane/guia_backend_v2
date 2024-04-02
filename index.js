require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const { checkAPI } = require("./middlewares/checkApi");

const router = require("./router")

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.send("Guia Backend V2");
});

app.use("/api",checkAPI, router);

const port = process.env.APP_PORT || 3001;

app.listen(port, () => {
  console.log("server "+port+" running");
});
