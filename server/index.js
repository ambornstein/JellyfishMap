import express from "express";
import cors from "cors";
import aquariums from "./routes/aquariums.js";
import reviews from "./routes/reviews.js";
import upload from "./routes/upload.js"
import jwt from "jsonwebtoken"


const port = process.env.PORT || 8080;
const app = express();

import db from "./db/connection.js";

app.use(cors());
app.use(express.json());
app.use("/aquariums", aquariums);
app.use("/reviews", reviews)
app.use("/upload", upload)

// start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;


  const collection = await db.collection("locations");
  const userWithEmail = await collection.findOne({ "email": email }).catch(
    (err) => console.log("Error: ", err))

  if (!userWithEmail)
    return res
      .status(400)
      .json({ message: "No user found with email!" })

  if (userWithEmail.password !== password)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" })
  else {
    const jwToken = jwt.sign(
      { id: userWithEmail._id, email: userWithEmail.email },
      process.env.JWT_SECRET
    )

    res.json({ message: "Welcome Back!", token: jwToken })
  }
})

app.get('/verify', async (req, res) => {
  const { token } = req.body
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      console.log(decoded) // bar
    })
    res.sendStatus(200)
  }
  catch (error) {
    console.log("Invalid token")
    res.sendStatus(403)
  }
})

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});
