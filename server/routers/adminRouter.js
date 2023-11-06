import { Router } from "express";
const router = Router();

// Mongo db imports
import { findAllUsers } from "../db/mongoDb.js";

import { mapDTO } from "../dto/userDTO.js";

export function isAuthenticated(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}

router.get("/admin/getMembers", isAuthenticated, async (req, res) => {
  try {
    const users = await findAllUsers();

    // cehck for user list found
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    // create dto array to send. Ensures password isnt sent to frontend
    const usersDTO = mapDTO(users);
    res.status(200).json({ data: usersDTO });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
