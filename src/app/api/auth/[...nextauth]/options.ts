import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma"; //prisma handles the connection
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        //directly query db
        try {
            //find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Compare passwords
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          //Return user object to auth (NextAuth will attach session)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks:{
    async session({session, token}){
        if(token){
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
        }
        return session
    },
    async jwt({token,user}){
        if (user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
        }
        return token
    },
    async redirect({url,baseUrl}) {
      return `${baseUrl}/`; // ⬅ ALWAYS redirect user to home
    },
  },
  session:{
    strategy:"jwt",
  },
  secret:process.env.NEXTAUTH_SECRET
  
};



// // //postgresql + prisma -> do NOT connect db inside authorize().
// // //prisma handles the connection automatically


