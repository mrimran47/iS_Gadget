import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';



const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const TARGET_EMAIL = process.env.TARGET_EMAIL;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});


export async function POST(request) {


    const body = await request.json();
    const { name, email, subject, message } = body;


    if (!name || !email || !message) {

        return NextResponse.json(
            { message: 'Missing required fields: name, email, and message.' },
            { status: 400 }
        );
    }


    if (!EMAIL_USER || !EMAIL_PASS || !TARGET_EMAIL) {
        console.error("Email configuration missing! Check EMAIL_USER, EMAIL_PASS, and TARGET_EMAIL in .env.local");
        return NextResponse.json(
            { message: 'Server configuration error: Email credentials missing.' },
            { status: 500 }
        );
    }

    try {

        const mailData = {
            from: `"${name} (via Contact Form)" <${EMAIL_USER}>`,
            to: TARGET_EMAIL,
            replyTo: email,
            subject: `Contact Form: ${subject || 'No Subject'} (From ${name})`,
            text: `
                Name: ${name}
                Email: ${email}
                Subject: ${subject || 'N/A'}
                ---
                Message:
                ${message}
            `,
            html: `
                <p>You have a new contact form submission:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Subject:</strong> ${subject || 'N/A'}</li>
                </ul>
                <hr>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; margin-top: 15px; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9;">${message}</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailData);

        // Success response
        return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error sending email:', error);
        // Failure response
        return NextResponse.json(
            {
                message: `Failed to send email. Check your server logs and email provider settings.`,
                error: error.message
            },
            { status: 500 }
        );
    }
}

