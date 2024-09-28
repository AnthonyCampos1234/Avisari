import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        secure: false,
        requireTLS: true,
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/forgot-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
        html: `
      <p>You requested a password reset.</p>
      <p>Please use the following link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully", info);
        return info;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email: " + (error instanceof Error ? error.message : String(error)));
    }
}