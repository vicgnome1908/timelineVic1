import { Prisma } from "./generated/prisma-client"

export interface Context {
  req: any
  prisma: Prisma
}
