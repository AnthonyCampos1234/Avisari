import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    const { email } = await req.json();

    try {
        // Check if user exists
        const { data: user, error: findError } = await supabase
            .from('User')
            .select('id')
            .eq('email', email)
            .single();

        if (user) {
            const resetToken = crypto.randomBytes(20).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

            // Update user with reset token
            const { error: updateError } = await supabase
                .from('User')
                .update({
                    resetToken,
                    resetTokenExpiry: resetTokenExpiry.toISOString(),
                })
                .eq('email', email);

            if (updateError) {
                throw updateError;
            }

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