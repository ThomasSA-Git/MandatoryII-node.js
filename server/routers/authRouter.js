import dotenv from "dotenv";

dotenv.config();

import { Router } from "express";

const router = Router();

import { hashPassword, comparePasswords } from "../util/bcrypt.js";

// Mongo db imports
import { createUser, findUserByUsername } from "../db/mongoDb.js";

import {
  registerMailSubject,
  registerMailMessage,
  sendFakeEmail,
} from "../nodemailer/nodemailer.js";

import { purify } from "../util/DOMpurify.js";

router.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user in database
  const user = await findUserByUsername(username);

  if (user) {
    // Cmpare the provided password with the hashed password in the database
    const match = await comparePasswords(password, user.password);

    if (match) {
      // Store user information in the session
      req.session.user = user;
      console.log("Login succesful.");
      // Send username and role to use for auth clientside.
      res.json({
        username: req.session.user.username,
        role: req.session.user.role,
      });
    } else {
      // Send a 401 status for incorrect password
      res.status(401).json({ error: "Invalid password." });
    }
  } else {
    // Send a 401 status for invalid username
    res.status(401).json({ error: "Invalid username." });
  }
});

router.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  // purify relevant input
  const purifiedUsername = purify(username);
  const purifiedEmail = purify(username);
  // Hash the password
  const hashedPassword = await hashPassword(password);

  // check if username exists
  const userExists = await findUserByUsername(username);
  
  if (userExists) {
    console.log("Username is taken.");
    res.status(401).json({ error: "Username is taken" });
  } else {
    // Create user in mongodb
    createUser(purifiedUsername, purifiedEmail, hashedPassword);

    // Send mail confirming registration
    const mailMessage = registerMailMessage(username);
    sendFakeEmail(email, registerMailSubject, mailMessage);

    // Message not necessary
    res.json({ message: "Registration successful." });
  }
});

router.get("/api/auth/logout", (req, res) => {
  // delete session
  delete req.session.user;
  // maybe delete below, not necessary
  res.send({ data: "You're logged out." });
});

export default router;
