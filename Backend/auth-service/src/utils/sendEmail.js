import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendOTPEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"Campus Marketplace" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Email Verification OTP",
//     html: `
//       <h2>Verify Your Account</h2>
//       <p>Your OTP is:</p>
//       <h1>${otp}</h1>
//       <p>This OTP will expire in 10 minutes.</p>
//     `,
//   });
// };
export const sendOTPEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER/EMAIL_PASS missing in environment");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Campus Marketplace" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `<h2>Verify Your Account</h2><h1>${otp}</h1>`,
  });
};
