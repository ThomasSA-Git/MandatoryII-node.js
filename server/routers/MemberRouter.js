import { Router } from "express";

const router = Router();

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    } else {
      res.send("Unauthorized");
    }
  }


  
  

export default router;