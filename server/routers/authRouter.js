import { Router } from "express";

const router = Router();

import { createUser, findUserByUsername } from "../db/db.js";

import { hashPassword, comparePasswords } from "../util/bcrypt.js"

import bodyParser from "body-parser";

router.use(bodyParser.urlencoded({ extended: true }));

import session from "express-session";

/* router.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
  })
); */

import dotenv from "dotenv";

dotenv.config();

import { registerMailSubject, registerMailMessage, sendFakeEmail } from "../nodemailer/nodemailer";

router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Find the user in the database
    const user = await findUserByUsername(username);
  
    if (user) {
      // Compare the provided password with the hashed password in the database
      const match = await comparePasswords(password, user.password);
  
      if (match) {
        // Store user information in the session
        req.session.user = user;
        res.redirect('/');
      } else {
        res.send('Invalid username or password');
      }
    } else {
      res.send('Invalid username');
    }
  });
  

  router.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log(username);
    // Create a new user in the database
    await createUser(username, email, hashedPassword);
    
    sendFakeEmail(email, registerMailSubject, registerMailMessage);

    // Consider where to redirect to
    res.redirect('/');
  });

export default router;