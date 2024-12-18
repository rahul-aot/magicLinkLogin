const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMagicLinkEmail({ email, token }) {
    const link = `http://localhost:3000/verify?token=${token}`;

    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL, // Verified sender email
        subject: 'Your Magic Login Link',
        html: `
            <p>Click the link below to log in:</p>
            <a href="${link}">${link}</a>
            <p>This link will expire in 1 hour.</p>
        `,
    };

    return sgMail.send(msg);
}

module.exports = sendMagicLinkEmail;
