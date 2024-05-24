import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId, Timestamp } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/:id", async (req, res) => {
    let collection = await db.collection("reviews")
    let query = { "locationId" : new ObjectId(req.params.id) };
    let result = await collection.find(query).toArray();

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});
  
router.post("/:id", async (req, res) => {
try {
    let newReview = {
    name: "Theresa",
    timestamp: Date.now(),
    content: req.body.reviewContent,
    ovrRating: req.body.ovrRating,
    jellyRating: req.body.jellyRating,
    locationId: new ObjectId(req.params.id)
    }
    let collection = await db.collection("reviews")
    let result = await collection.insertOne(newReview)
    res.send(result).status(204);
} catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
}

});

export default router;