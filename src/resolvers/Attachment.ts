import { prismaObjectType } from "nexus-prisma"

// @ts-ignore
export const Attachment = prismaObjectType({
  name: "Attachment",
  definition(t) {
    t.prismaFields(["*"])
  }
})
