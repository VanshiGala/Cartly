import NextAuth from "next-auth/next"; //create authentication route
import { authOptions } from "./options";

const handler = NextAuth(authOptions) //process authentication

export {handler as GET, handler as POST}

//in nextjs app router, api routes require HTTP methods to be exported explicitly
//GET ->Fetch session, render login pages, redirect, sign-out
//POST ->Submit credentials, login, callback processing