import express from "express";
import cors from "cors";
import aquariums from "./routes/aquariums.js";
import reviews from "./routes/reviews.js";
import upload from "./routes/upload.js"

const PORT = 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/aquariums", aquariums);
app.use("/reviews", reviews)
app.use("/upload", upload)

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
