import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, email } = await req.json();

    try {
        const { data: updatedUser, error } = await supabase
            .from('User')
            .update({ name, email })
            .eq('id', session.user.id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Error in user update route:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}