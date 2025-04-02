import express from "express"
import cors from "cors";
import path from "path"

import auth from "./routes/auth.js"
import aquariums from "./routes/aquariums.js";
import reviews from "./routes/reviews.js";
import upload from "./routes/upload.js"

const app = express();

//SETUP
const publicPath = path.join(path.resolve(), 'build');
app.use(express.static(publicPath));
app.use(cors());
app.use(express.json());

app.use("/api/auth", auth)
app.use("/api/reviews", reviews)
app.use("/api/upload", upload)
app.use("/api/aquariums", aquariums)

app.use('/',  (req, res) => {
  res.sendFile(path.join(path.resolve(), 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
})