import express from "express";
import Multer from "multer";
import { Storage } from "@google-cloud/storage"

const router = express.Router();

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  })
  
  let projectId = "aquarium-jellyfish-ratings";
  let keyFilename = "\key.json";
  const storage = new Storage({
    projectId,
    keyFilename
  })
  const bucket = storage.bucket('aquarium-photos')


console.log(storage.getBuckets())
  
router.post('/', multer.single('imgfile'), (req,res) => {
    try {
        if (req.file) {
        console.log("File found, trying to upload...")
        const blob = bucket.file(req.file.originalname)
        const blobStream = blob.createWriteStream();

        blobStream.on('finish', () => {
            res.status(200).send("Success");
            console.log("Success")
        })
        blobStream.end(req.file.buffer);
        }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
})

export default router;