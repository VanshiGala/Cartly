import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {prisma} from "../../../lib/prisma";
import { emailQueue } from "src/queue/emailQueue";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  //producer -> adds job to queue
  await emailQueue.add('welcome-mail',{
    to:email,
    subject:"Welcome to Cartly",
    text:"This is the biggest e-commerce platform"
  })

  return NextResponse.json({ message: "User created successfully" });
}


