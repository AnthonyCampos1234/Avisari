import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.userType !== 'advisor') {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('id');

    try {
        const { data: student, error: studentError } = await supabase
            .from('User')
            .select('id, name, email')
            .eq('id', studentId)
            .single();

        if (studentError) {
            throw studentError;
        }

        const { data: schedule, error: scheduleError } = await supabase
            .from('schedules')
            .select('data')
            .eq('user_email', student.email)
            .single();

        if (scheduleError) {
            throw scheduleError;
        }

        return NextResponse.json({ ...student, schedule: schedule.data });
    } catch (error) {
        console.error("Error fetching student details:", error);
        return NextResponse.json({ error: "Failed to fetch student details" }, { status: 500 });
    }
}