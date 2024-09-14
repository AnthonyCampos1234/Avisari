import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}