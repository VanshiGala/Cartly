import { prisma } from "../../../lib/prisma"; 
import bcrypt from "bcryptjs"; //never store plain pass

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;

  const hashed = await bcrypt.hash(password, 10); //convert

  //create user in db
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
    },
  });

  return Response.json(user, { status: 201 });
}

//fetch all user
//this runs "SELECT * FROM "USER" "
//console show exact prisma query
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
