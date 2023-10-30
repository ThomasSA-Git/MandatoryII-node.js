import express, { urlencoded } from "express";

const app = express();

import cors from "cors";

import { corsOptions } from "./util/cors.js";

// add cors options here
app.use(cors());

import dotenv from "dotenv";

dotenv.config();

app.use(urlencoded({ extended: false }));

import rateLimit from "express-rate-limit";

app.use(express.json());


const allRoutesRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
  });
  
  app.use(allRoutesRateLimiter);
  
  // Rate limiter specific for login. Overrides the above for the specific path as set below.
  const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
  });

  import authRouter from "./routers/authRouter.js";
  app.use(authRouter);

  import contactRouter from "./routers/concactRouter.js"
  app.use(contactRouter);

  import memberRouter from "./routers/MemberRouter.js";
  app.use(memberRouter);

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => console.log("Running on port:", PORT));