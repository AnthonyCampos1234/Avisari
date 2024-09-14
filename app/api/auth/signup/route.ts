import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
        console.error("Error in signup route:", error);
        return NextResponse.json({ error: error.message || "User creation failed" }, { status: 500 });
    }
}