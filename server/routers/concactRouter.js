import { Router } from "express";

const router = Router();

import { contactMailSubject, contactMailMessage, sendFakeEmail } from "../nodemailer/nodemailer.js";

router.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    const mailMessage = contactMailMessage(message);
    sendFakeEmail(email, contactMailSubject, mailMessage)
    .then(() => {
        res.status(200).json({ success: true, message: "Email sent successfully." });
    })
    .catch((error) => {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email. Please try again later." });
    });
});

export default router;