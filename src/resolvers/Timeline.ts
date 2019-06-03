import { prismaObjectType } from "nexus-prisma"

// @ts-ignore
export const Timeline = prismaObjectType({
  name: "Timeline",
  definition(t) {
    t.prismaFields(["*"])

    t.int("like_count", {
      description: "number of like",
      resolve: async ({ id }, { args }, ctx) => {
        const like = await ctx.prisma.actions({
          where: {
            AND: {
              type: "LIKE",
              timeline: {
                id
              },
              comment: null
            }
          }
        })
        return like.length
      }
    })

    t.int("share_count", {
      description: "number of like",
      resolve: async ({ id }, { args }, ctx) => {
        const share = await ctx.prisma.actions({
          where: {
            AND: {
              type: "SHARE",
              timeline: {
                id
              }
            }
          }
        })
        return share.length
      }
    })

    t.int("comment_count", {
      description: "number of comment",
      resolve: async ({ id }, { args }, ctx) => {
        const comment = await ctx.prisma.actions({
          where: {
            AND: {
              type: "COMMENT",
              timeline: {
                id
              }
            }
          }
        })
        return comment.length
      }
    })

    t.int("interaction_count", {
      description: "number of interaction",
      resolve: async ({ id }, { args }, ctx) => {
        const interaction = await ctx.prisma.actions({
          where: {
            timeline: {
              id
            }
          }
        })
        return interaction.length
      }
    })
  }
})
