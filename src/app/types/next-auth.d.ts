import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    email: string;
    name?: string | null;
    isVerified? : boolean;
    isAcceptingMessages? : boolean;
  }

  interface Session { //by default it only conatins name, email, img
    //tell ts what session will return
    user: {
      id?: string;
      email: string;
      name?: string | null;
      isVerified? : boolean;
      isAcceptingMessages? : boolean;
    } & DefaultSession["user"]; //default key
  }
}

//another way
declare module "next-auth/jwt" {
  interface JWT {
    id? : string;
    email: string;
    name?: string | null;
    isVerified? : boolean;
    isAcceptingMessages? : boolean;
  }
}


//with Credentials Provider, you control what is returned to NextAuth, not OAuth.
//tell typescript -> what user looks like, which fields u want in session.user and JWT