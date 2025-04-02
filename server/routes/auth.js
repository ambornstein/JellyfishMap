import express from "express";
import jwt from "jsonwebtoken"

import db from "../db/connection.js";

const router = express.Router();

//Authentication
router.post("/login", async (req, res) => {
    console.log(req.query.email)

    const collection = await db.collection("users");
    const userWithEmail = await collection.findOne({ "email": req.query.email }).catch(
        (err) => console.log("Error: ", err))

    if (!userWithEmail)
        return res
            .status(400)
            .json({ message: "No user found with email!" })

    if (userWithEmail.password !== req.query.password) {
        console.log(userWithEmail.password)
        return res
            .status(400)
            .json({ message: "Email or password does not match!" })
    }
    else {
        const jwToken = jwt.sign(
            { id: userWithEmail._id, email: userWithEmail.email },
            process.env.JWT_SECRET
        )

        res.json({ message: "Welcome Back!", token: jwToken })
    }
})

router.get('/verify', async (req, res) => {
    const { token } = req.body
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            console.log(decoded) // bar
        })
        res.sendStatus(200)
    }
    catch (error) {
        console.log("Invalid token")
        res.sendStatus(403)
    }
})

export default router;