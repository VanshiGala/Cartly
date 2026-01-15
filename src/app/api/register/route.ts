import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {prisma} from "../../../lib/prisma";
import { emailQueue } from "src/queue/emailQueue";

export async function POST(req: Request) {
  try{
  const { email, password, name } = await req.json();

      if (!email || !password || !name) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

 const user =  await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  //producer -> adds job to queue
  await emailQueue.add('welcome-mail',{
    to:email,
    subject:"Welcome to Cartly",
    text:"This is the biggest e-commerce platform"
  })

  return NextResponse.json({ 
    message: "User created successfully",
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
}catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
