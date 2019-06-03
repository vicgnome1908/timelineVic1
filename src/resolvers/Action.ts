import { prismaObjectType } from "nexus-prisma"

// @ts-ignore
export const Action = prismaObjectType({
  name: "Action",
  definition(t) {
    t.prismaFields(["*"])
  }
})
