const nodemailer = require('nodemailer');

exports.sendMail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.PASS,
    to: process.env.MAIL_TO,
    subject: 'New Contact Form Submission',
    html: `
      <h3>Contact Submission</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Website:</strong> ${data.website}</p>
      <p><strong>Project Type:</strong> ${data.projectType}</p>
      <p><strong>Services:</strong> ${data.services.join(', ')}</p>
    `,
  });
};
