import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.userType !== 'advisor') {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userType = searchParams.get('userType');

    try {
        const { data: students, error } = await supabase
            .from('User')
            .select('id, name, email')
            .eq('user_type', userType || 'student');

        if (error) {
            throw error;
        }

        return NextResponse.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
}
