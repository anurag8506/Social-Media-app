const nodemailer = require('nodemailer');
const FormSubmission = require('../models/inquirey'); // Your Mongoose model

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  secure: true,
  secureConnection: false,
  tls: {
    rejectUnauthorized: false
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: process.env.USER || "verma.akash2025@gmail.com",
    pass: process.env.PASS || "dchlmfpimhsaqbqc"
  }
});

exports.submitForm = async (req, res) => {
  try {
    const { name, email, company, website, projectType, services } = req.body;

    // Validation
    if (!name || !email || !projectType || !services) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, project type and services are required fields'
      });
    }

    // Save to database
    const newSubmission = new FormSubmission({
      name,
      email,
      company: company || '',
      website: website || '',
      projectType,
      services: Array.isArray(services) ? services : [services],
      submittedAt: new Date()
    });

    const savedSubmission = await newSubmission.save();

    // Prepare email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Project Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        ${website ? `<p><strong>Website:</strong> ${website}</p>` : ''}
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Services Needed:</strong></p>
        <ul>
          ${services.map(service => `<li>${service}</li>`).join('')}
        </ul>
        <p style="margin-top: 20px;">This inquiry was submitted on ${new Date().toLocaleString()}</p>
      </div>
    `;

    // Send email to admin
    const adminMailOptions = {
      from: 'TYRA VENTURES <verma.akash2025@gmail.com>',
      to: "verma.akash2025@gmail.com",
      subject: `New Project Inquiry: ${projectType}`,
      html: emailContent
    };

    // Send confirmation email to user
    const userMailOptions = {
      from: 'TYRA VENTURES <verma.akash2025@gmail.com>',
      to: email,
      subject: 'Thank you for your inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you, ${name}!</h2>
          <p>We've received your inquiry about a <strong>${projectType}</strong> and will review it shortly.</p>
          <p><strong>Services you're interested in:</strong></p>
          <ul>
            ${services.map(service => `<li>${service}</li>`).join('')}
          </ul>
          <p>Our team will get back to you within 2 business days.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Tyra  VENTURES Team</p>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(201).json({
      success: true,
      message: 'We will connect soon!',
      data: savedSubmission
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your submission',
      error: error.message
    });
  }
};