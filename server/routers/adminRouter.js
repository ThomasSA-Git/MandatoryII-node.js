import { Router } from "express";
const router = Router();

import { users } from "../db/tempdb.js";

export function isAuthenticated(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === "admin") {
        return next();
    } else {
      res.status(401).send('Unauthorized');
    }
  }

router.get("/admin/getMembers", isAuthenticated, (req, res) => {
    res.send({ data: users });
});

export default router;