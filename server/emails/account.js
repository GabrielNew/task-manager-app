import nodemailer from "nodemailer";
const { USER_EMAIL, USER_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
});

async function sendEmail(email, subject, message) {
  const info = await transporter.sendMail({
    from: USER_EMAIL,
    to: email,
    subject: subject,
    text: message,
  });

  console.log("Message sent: %s", info.messageId);
  //console.log(email, subject, message);
}

//sendEmail().catch(console.error);

export { sendEmail };
