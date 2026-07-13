require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});



// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(to, name) {
  const subject = 'Welcome to Our Service!';
  const text = `Hello ${name},\n\nThank you for registering with our service. We're excited to have you on board!`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering with our service. We're excited to have you on board!</p>`;

    await sendEmail(to, subject, text, html);

}

async function sendTransactionEmail(to, name, amount, fromAccount, toAccount) {
  const subject = 'Transaction Successful!';
  const text = `Hello ${name},\n\nYour transaction of ${amount} from account ${fromAccount} to account ${toAccount} was successful.`;
  const html = `<p>Hello ${name},</p><p>Your transaction of ${amount} from account ${fromAccount} to account ${toAccount} was successful.</p>`;

    await sendEmail(to, subject, text, html);
}

async function sendTransactionFailureEmail(to, name, amount, fromAccount, toAccount) {
  const subject = 'Transaction Failed!';
  const text = `Hello ${name},\n\nYour transaction of ${amount} from account ${fromAccount} to account ${toAccount} has failed. Please try again.`;
  const html = `<p>Hello ${name},</p><p>Your transaction of ${amount} from account ${fromAccount} to account ${toAccount} has failed. Please try again.</p>`;

    await sendEmail(to, subject, text, html);
}





module.exports = {transporter,sendEmail,sendRegistrationEmail,sendTransactionEmail,sendTransactionFailureEmail};