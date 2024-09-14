import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { email } = await req.json();

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const resetToken = crypto.randomBytes(20).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

            await prisma.user.update({
                where: { email },
                data: { resetToken, resetTokenExpiry },
            });

            // Send password reset email
            await sendPasswordResetEmail(email, resetToken);
        }

        // Always return a success message to prevent email enumeration
        return NextResponse.json({ message: "If an account exists for that email, a password reset link has been sent." });
    } catch (error) {
        console.error("Error in forgot-password route:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}