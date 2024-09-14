import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
        return NextResponse.json({ error: error.message || "User creation failed" }, { status: 500 });
    }
}