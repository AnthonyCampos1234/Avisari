import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    const { token, password } = await req.json();

    try {
        // Find user with valid reset token
        const { data: user, error: findError } = await supabase
            .from('User')
            .select('id')
            .eq('resetToken', token)
            .gt('resetTokenExpiry', new Date().toISOString())
            .single();

        if (findError || !user) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear reset token
        const { error: updateError } = await supabase
            .from('User')
            .update({
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            })
            .eq('id', user.id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in reset-password route:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}