import sgMail from "@sendgrid/mail";
import "dotenv/config";

const senderEmail = process.env.SENDER_EMAIL;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (email, verificationToken) => {
  return {
    to: email,
    from: senderEmail,
    subject: "Verify your email at MariGK Rest API app",
    text: "verify your email",
    html: `<a href="/users/verify/${verificationToken}">verify your email</a>`,
  };
};

const sendVerificationEmail = (email, verificationToken) =>
  sgMail
    .send(msg(email, verificationToken))
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

export default sendVerificationEmail;
