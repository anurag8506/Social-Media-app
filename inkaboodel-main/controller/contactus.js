const Inquiry = require('../models/inquirey');
const nodemailer = require('nodemailer');

exports.submitInquiry = async (req, res) => {
  const { firstName, lastName, email, phone, state, address, message, purpose } = req.body;
  console.log(req)

  try {
    const inquiry = new Inquiry({ firstName, lastName, email, phone, state, address, message, purpose });
    await inquiry.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.MAIL_EMAIL,
      subject: `New Inquiry from ${firstName} ${lastName}`,
      html: `
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Purpose:</strong> ${purpose}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'We Connect Soon' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
