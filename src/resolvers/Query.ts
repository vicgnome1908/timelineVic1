import { idArg, queryType, stringArg } from "nexus"
import { getUserId } from "../utils"
// import 'apollo-cache-control'

export const Query = queryType({
  definition(t) {
    t.field("me", {
      type: "User",
      description: "current user info",
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user({ id: userId })
      }
    })

    t.list.field("searchUsers", {
      type: "User",
      args: {
        searchString: stringArg({ nullable: true })
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.users({
          where: {
            OR: [
              { username_contains: searchString },
              { email_contains: searchString }
            ]
          }
        })
      }
    })

    t.list.field("feed", {
      type: "Timeline",
      description: "list of published timeline",
      resolve: (parent, args, ctx, info) => {
        // info.cachecontrol.setCacheHint({maxAge: 60, scope: 'PRIVATE'})
        return ctx.prisma.timelines({
          where: { isPublished: true }
        })
      }
    })

    t.list.field("filterTimelines", {
      type: "Timeline",
      args: {
        searchString: stringArg({ nullable: true })
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.timelines({
          where: {
            OR: [
              { title_contains: searchString },
              { content_contains: searchString }
            ]
          }
        })
      }
    })

    t.field("timeline", {
      type: "Timeline",
      description: "find info about a timeline by id",
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.timeline({ id })
      }
    })
  }
})
