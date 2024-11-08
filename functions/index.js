const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {v4: uuidv4} = require("uuid");

admin.initializeApp();
const bucket = admin.storage().bucket();

exports.uploadProfileImage = functions.https.onRequest((req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(403).send("Unauthorized");
  }

  const token = req.headers.authorization.split("Bearer ")[1];
  admin.auth().verifyIdToken(token)
      .then(async (decodedToken) => {
        const userId = decodedToken.uid;

        // Check for file data in the request
        const contentType = req.headers["content-type"];
        if (!contentType || !contentType.startsWith("multipart/form-data")) {
          return res.status(400).json({error: "Invalid file upload"});
        }

        // Extract boundary for parsing multipart data
        const boundary = contentType.split("boundary=")[1];
        if (!boundary) return res.status(400).json({error: "Invalid multipart data"});

        // Parse the raw body to isolate the image data
        const rawBody = req.rawBody.toString("binary"); // Use binary encoding to preserve data
        const parts = rawBody.split(`--${boundary}`);
        const filePart = parts.find((part) => part.includes("Content-Type: image"));

        if (!filePart) return res.status(400).json({error: "No image file found"});

        // Extract image binary data without altering
        const startIndex = filePart.indexOf("image") + filePart.match(/image\/\w+/)[0].length + 4;
        const fileBuffer = Buffer.from(filePart.slice(startIndex, filePart.lastIndexOf("\r\n")), "binary");

        // Determine original file extension based on MIME type
        const extension = filePart.includes("image/jpeg") ? "jpg" : filePart.includes("image/png") ? "png" : null;
        if (!extension) {
          return res.status(400).json({error: "Only JPEG and PNG formats are supported"});
        }

        const filePath = `profilePictures/${userId}/${uuidv4()}.${extension}`;
        const fileUpload = bucket.file(filePath);

        const tokenForUrl = uuidv4();

        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: `image/${extension}`,
            metadata: {firebaseStorageDownloadTokens: tokenForUrl},
          },
        });

        blobStream.on("error", (error) => {
          console.error("Upload error:", error);
          return res.status(500).json({error: error.message});
        });

        blobStream.on("finish", async () => {
          const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media&token=${tokenForUrl}`;

          try {
          // Save the download URL in Firestore under the ProfilePic field
            const userRef = admin.firestore().collection("users").doc(userId);
            await userRef.set({ProfilePic: downloadUrl}, {merge: true});

            res.status(200).json({downloadUrl});
          } catch (error) {
            console.error("Error saving URL to Firestore:", error);
            res.status(500).json({error: "Failed to save profile picture URL in Firestore"});
          }
        });

        blobStream.end(fileBuffer); // End the stream with the raw binary data of the image
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        return res.status(403).send("Unauthorized");
      });
});
