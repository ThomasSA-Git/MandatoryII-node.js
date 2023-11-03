import { Router } from "express";

const router = Router();

import { contactMailSubject, contactMailMessage, sendFakeEmail } from "../nodemailer/nodemailer.js";

router.post("/contact", (req, res) => {
    const contactData = req.body;

    sendFakeEmail(contactData.email, contactMailSubject, contactMailMessage);

    // Handle or save message to database?

    // some response here
});

export default router;