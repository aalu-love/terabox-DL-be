const express = require("express");
const app = express();

const { uploadFileToMEGA, downloadFileFromMEGA } = require("./util.js");
const { getLinkInfo, getDownloadLink } = require("./helper.js");

require("dotenv").config();

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/upload", async (req, res) => {
  await uploadFileToMEGA(
    {
      email: MEGA_EMAIL,
      password: MEGA_PASSWORD,
    },
    "https://file-examples.com/wp-content/storage/2017/04/file_example_MP4_480_1_5MG.mp4"
  );
  return res.send("Upload in Process....");
});

app.get("/api/v1/geturldata", async (req, res) => {
  const { shorturl } = req.query;
  try {
    const result = await getLinkInfo(shorturl);
    const data = await getDownloadLink(result);
    return res.status(200).json({
      original: result,
      dlink: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running at http://localhost:${process.env.PORT || 3000}/`
  );
});
