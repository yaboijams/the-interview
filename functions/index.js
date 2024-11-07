const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const {v4: uuidv4} = require("uuid");

admin.initializeApp();

const bucket = admin.storage().bucket();

exports.uploadProfileImage = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(403).send("Unauthorized");
    }

    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userId = decodedToken.uid;

      if (!req.files || !req.files.file) {
        return res.status(400).send("No file uploaded.");
      }

      const file = req.files.file;
      const filename = `profilePictures/${userId}/${uuidv4()}_${file.name}`;
      const fileUpload = bucket.file(filename);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {firebaseStorageDownloadTokens: uuidv4()},
        },
      });

      blobStream.on("error", (error) => {
        return res.status(500).json({error: error.message});
      });

      blobStream.on("finish", async () => {
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${uuidv4()}`;
        res.status(200).json({downloadUrl});
      });

      blobStream.end(file.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({error: "Error uploading file"});
    }
  });
});
