import { Router } from "express";
const router = Router();

// Mongo db imports
import { findAllUsers } from '../db/mongoDb.js';

export function isAuthenticated(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === "admin") {
        return next();
    } else {
      res.status(401).send('Unauthorized');
    }
  }

router.get("/admin/getMembers", isAuthenticated, async (req, res) => {
    const users = await findAllUsers();
    res.send({ data: users });
});

export default router;