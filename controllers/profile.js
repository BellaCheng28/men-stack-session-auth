import express from "express";

import validSession from "../middleware/validSession.js";

const router = express.Router()

router.get("/", validSession, (req, res) => {
  try {
    res.render("profile/index.ejs", { user: req.session.user})
  } catch (error) {
    console.error(error)
    res.status(400).send(error.message)
  }
})

router.post("/", validSession, (req, res) => {
  try {
    // Create profile logic
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

router.delete("/", validSession, (req, res) => {
  try {
    // Delete the profile
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

export default router
