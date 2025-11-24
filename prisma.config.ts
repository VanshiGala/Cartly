import { defineConfig, env } from "prisma/config"; //config helpers
import "dotenv/config"
export default defineConfig({
  schema: "prisma/schema.prisma", //tells prisma where schema file is located
  migrations: {
    path: "prisma/migrations",
  }, //store migration sql here
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
