import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
  const { username } = req.query
  res.render("auth/sign-in.ejs", { username: username })
})

router.get("/sign-out", (req, res) => {
  req.session.destroy(()=>{
  res.redirect("/");
  });
  
});   //新增

router.post("/sign-up", async (req, res) => {
  try {
    // Grab form data from req.body
    let { username, password, confirmPassword } = req.body;

    // Validate password and confirm password to be matching
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }

    // Validate the password
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/.test(password)) {
      throw new Error("Provide one upper and one lower case letter, one number, and one special character.")
    }

    // Check if user with the username provided already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      throw new Error(`User with username: ${username} already exists`);
    }

    // Hash the password
    password = bcrypt.hashSync(password, 10);

    // If above checks pass, create a new user
    const newUser = await User.create({ username, password });
    if (newUser) {
      res.redirect(`/auth/sign-in?username=${newUser.username}`);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body
    // Check if user is actually real
    const user = await User.findOne({ username: username })
    if(!user) {
      throw new Error("User with that username does not exist")
    }

    // Compare provided and stored passwords
    const validPassword = bcrypt.compareSync(
      password,
      user.password
    )
    if (!validPassword) {
      throw new Error("Provided password is wrong")
    }

    // Create session
    req.session.user = {
      username: user.username
    }
     req.session.save(() =>res.status(200).  redirect("/"));   //新改
    
  } catch (error) {
    console.error(error)
    res.status(400).send(error.message)
  }
});

export default router;
