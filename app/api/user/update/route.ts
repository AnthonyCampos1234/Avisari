import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, email } = await req.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { email: session.user?.email as string },
            data: { name, email },
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error("Error in user update route:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}