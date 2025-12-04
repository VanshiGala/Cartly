// import {PrismaClient} from "@prisma/client"

// const globalForPrisma = global as unknown as {prisma: PrismaClient};

// export const prisma = globalForPrisma.prisma || new PrismaClient({
//     log:["query"], //log every SQL query prisma runs (for debugging)
// }) //if prisma client exists already -> reuse it else create new one

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

//Because in Next.js dev mode, your files reload many times → PrismaClient would be created again and again → too many DB connections → Neon will crash.
//So we attach prisma to the global object so only ONE instance exists.