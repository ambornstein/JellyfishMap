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
  let keyFilename = "key.json";
  const storage = new Storage({
    projectId,
    keyFilename
  })
  const bucket = storage.bucket('aquarium-photos')
  
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

router.post('/:id', multer.single('imgfile'), (req,res) => {
  try {
      if (req.file) {
      console.log("File found, trying to upload...")
      const blob = bucket.file(req.params.id + "/" + req.file.originalname)
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

  

router.get('/:id', async (req, res) => {
  // These options will allow temporary read access to the file
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  }

  const [files] = await bucket.getFiles({prefix: req.params.id + "/"})
  let links = files.map((file) => file.getSignedUrl(options))
  Promise.all(links).then((out) => res.send(out).status(200))
})

export default router;