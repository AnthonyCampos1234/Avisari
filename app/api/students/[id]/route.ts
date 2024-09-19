import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.userType !== 'advisor') {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const studentId = params.id;

    if (!studentId) {
        return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    try {
        const { data: student, error: studentError } = await supabase
            .from('User')
            .select('id, name, email')
            .eq('id', studentId)
            .single();

        if (studentError) {
            console.error("Error fetching student:", studentError);
            return NextResponse.json({ error: studentError.message }, { status: 500 });
        }

        const { data: schedule, error: scheduleError } = await supabase
            .from('schedules')
            .select('data')
            .eq('user_email', student.email)
            .single();

        if (scheduleError) {
            console.error("Error fetching schedule:", scheduleError);
            return NextResponse.json({ error: scheduleError.message }, { status: 500 });
        }

        return NextResponse.json({ ...student, schedule: schedule.data });
    } catch (error) {
        console.error("Error fetching student details:", error);
        return NextResponse.json({ error: "Failed to fetch student details" }, { status: 500 });
    }
}