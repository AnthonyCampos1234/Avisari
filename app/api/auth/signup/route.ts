import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const now = new Date().toISOString();

        const { data: user, error } = await supabase
            .from('User')
            .insert({
                name,
                email,
                phone,
                password: hashedPassword,
                createdAt: now,
                updatedAt: now,
            })
            .select('id, name, email')
            .single();

        if (error) throw error;

        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
        console.error("Error in signup route:", error);
        return NextResponse.json({ error: error.message || "User creation failed" }, { status: 500 });
    }
}