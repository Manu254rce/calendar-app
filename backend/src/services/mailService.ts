import Mailjet from 'node-mailjet';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: ' email-errors.log' })
  ]
});

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY || '4f913698cab6ec702c9f0f69e9f48b84',
  apiSecret: process.env.MAILJET_SECRET_KEY || '07821e2665c0a041b3a346475ea11bcc'
});

console.log('Mailjet configured with API Key:', process.env.MAILJET_API_KEY);

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  logger.info('Attempting to send email', { to, subject });

  if (!isValidEmail(to)) {
    throw new Error('Invalid email address');
  }

  try {
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "emmanuellamira20@outlook.com",
            Name: "Calendar App"
          },
          To: [
            {
              Email: to
            }
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: html
        }
      ]
    });
    console.log('Email sending result:', result);
    console.log('Email sent successfully');
    return result.body;
  } catch (error) {
    console.error('Detailed Email Error:', error);

    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
    }
    throw error;
  }
};