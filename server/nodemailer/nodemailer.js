import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

export async function sendFakeEmail(userEmail, subject, message) {
    // Create a test account using Ethereal
    const testAccount = await nodemailer.createTestAccount();
  
    // Create a transporter object using the test account
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  
    // Setup email data
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: userEmail,
      subject: subject,
      text: message
    };
  
    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
  
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  };

  export const contactMailSubject = "Message sent."
  //export const contactMailMessage = "Your message has been submitted."

  export function contactMailMessage(message){
    return `You have submitted the follow message: ${message}`;
  }

  export const registerMailSubject = "Registration"
  export function registerMailMessage(username){
    return `You have succesfully been registered with the username: ${username}`;
  };