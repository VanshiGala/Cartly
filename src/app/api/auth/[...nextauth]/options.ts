import { NextAuthOptions } from "next-auth"; //type def
import bcrypt from "bcryptjs"; //comapre hashed pass
import { prisma } from "../../../../lib/prisma"; //prisma handles the connection
import CredentialsProvider from "next-auth/providers/credentials"; //allow user to signin using custom credential

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: { //define input fields for login
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> { //called when login
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
            session.user.id = token.id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
        }
        return session
    },
    async jwt({token,user}){
        if (user){
            token.id = user.id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
        }
        return token
    },
    async redirect({url,baseUrl}) {
      return `${baseUrl}/`; // ALWAYS redirect user to home
      //determines where users are sent after login/logout
    },
  },
  session:{ //session instead of db
    strategy:"jwt",
    maxAge: 60*60 
  },
  secret:process.env.NEXTAUTH_SECRET
  
};



 //postgresql + prisma -> do NOT connect db inside authorize().
 //prisma handles the connection automatically


