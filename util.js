const axios = require("axios");
const { Storage, File: MegaFile } = require("megajs");

const loginToMEGA = async (email, password) => {
  return new Promise((resolve, reject) => {
    const storage = new Storage({ email, password });
    storage.on("ready", () => resolve(storage));
    storage.on("error", (err) => reject(err));
  });
};

const downloadFile = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    throw new Error("Error downloading file: " + (error.message || error));
  }
};

const uploadFileToMEGA = async ({ email, password }, url) => {
  try {
    // Create a new Storage instance and authenticate
    const storage = await loginToMEGA(email, password);

    const fileStream = await downloadFile(url);

    // Create a new file on MEGA with the name 'video.mp4'
    const megaFile = storage.upload({
      name: "video.mp4",
      size: fileStream.length,
      attributes: { type: "file" },
    });

    // Pipe the downloaded video data to the MEGA file
    await megaFile.write(fileStream);

    // Handle events
    megaFile.on("error", (err) => {
      console.error("MEGA Upload Error:", err);
    });

    megaFile.on("complete", () => {
      console.log("MEGA Upload Complete");
    });

    megaFile.on("progress", (stats) => {
      console.log(`Uploading: ${stats.bytesLoaded}/${stats.bytesTotal} bytes`);
    });
  } catch (error) {
    console.error("Error:", error || error);
  }
};

const downloadFileFromMEGA = async ({ email, password }, url) => {
  try {
    // Login to MEGA
    const storage = await loginToMEGA(email, password);

    // Create a File instance from the MEGA.nz URL
    const file = MegaFile;

    // Load attributes of the file
    await file.loadAttributes(storage);

    // Display file information
    console.log("File name:", file.name);
    console.log("File size:", file.size, "bytes");

    // Download the file content as a buffer
    const data = await file.downloadBuffer();

    // Display the file contents (assuming it's a text file)
    console.log("File contents:", data.toString());
  } catch (error) {
    console.error("Error:", error.message || error);
  }
};

module.exports = {
  downloadFile,
  uploadFileToMEGA,
  downloadFileFromMEGA,
};
