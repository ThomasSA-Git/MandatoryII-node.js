import { Router } from "express";

const router = Router();

import {
  updateUserPassword,
  findUserByUsername,
  findUserInResetPassword,
  addToResetPassword,
  deleteUserTokenByUsername,
  updateUserAddress,
} from "../db/mongoDb.js";

import { generateToken } from "../util/tokenGenerator.js";

import { hashPassword } from "../util/bcrypt.js";

import {
  passwordResetSubject,
  passwordResetMessage,
  sendFakeEmail,
} from "../nodemailer/nodemailer.js";

import { createUserResponse } from "../dto/userResponse.js";

import { purify } from "../util/DOMpurify.js";

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.send({ message: "Unauthorized" });
  }
}

// maybe use session instead of path variable..?
router.get("/api/member/getMember/", isAuthenticated, async (req, res) => {
  try {
    // finduser in db
    const username = req.session.user.username;
    const user = await findUserByUsername(username);

    if (user) {
      // create dto for response
      const userResponse = createUserResponse(user);
      res.status(200).json({ user: userResponse });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/member/updateAddress", isAuthenticated, async (req, res) => {
  try {
    const { username, address } = req.body;

    const purifiedAddress = {
      streetname: purify(address.streetname),
      cityname: purify(address.cityname),
      zipcode: purify(address.zipcode),
    };
    // updates address of users in db
    const success = await updateUserAddress(username, purifiedAddress);
    if (success) {
      res.status(200).json({ message: "Address succesfully updated." });
    } else {
      console.log("error in db");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/api/member/getSecretToken", async (req, res) => {
  try {
    const username = req.body.username;
    const userExists = await findUserByUsername(username);

    // checks if user already has one active token
    const findExistingToken = await findUserInResetPassword(username);

    // deletes active token if it exists
    if (findExistingToken) {
      await deleteUserTokenByUsername(username);
    }

    // Generates new token and adds it to the db with username in seperate document with 30 min lifespan.
    if (userExists) {
      const token = generateToken();
      await addToResetPassword(username, token);

      const message = passwordResetMessage(username, token);
      sendFakeEmail(userExists.email, passwordResetSubject, message);

      res
        .status(200)
        .json({ message: "Password reset token sent successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/api/member/resetPassword", async (req, res) => {
  try {
    const { username, secretToken, newPassword } = req.body;

    // check if token with username is stoed in db
    const match = await findUserInResetPassword(username);

    if (match && secretToken === match.secretToken) {
      // hash new password, update it and delete the token used for it
      const hashedNewPassword = await hashPassword(newPassword);
      //update password for user
      await updateUserPassword(username, hashedNewPassword);
      // deletes token used for update of password
      await deleteUserTokenByUsername(username);
      res.status(200).json({ message: "Password reset successful." });
    } else {
      res.status(401).json({ error: "Invalid token or username." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
