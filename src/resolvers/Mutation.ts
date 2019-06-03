import { idArg, mutationType, stringArg } from "nexus"
import { compare, hash } from "bcrypt"
import { APP_SECRET, getUserId } from "../utils"
import { sign } from "jsonwebtoken"

export const Mutation = mutationType({
  definition(t) {
    t.field("signup", {
      type: "AuthPayload",
      args: {
        username: stringArg({ nullable: true }),
        email: stringArg(),
        password: stringArg()
      },
      resolve: async (parent, { username, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10)
        const user = await ctx.prisma.createUser({
          username,
          email,
          password: hashedPassword
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user
        }
      }
    })

    t.field("login", {
      type: "AuthPayload",
      args: {
        email: stringArg(),
        password: stringArg()
      },
      resolve: async (parent, { email, password }, context) => {
        const user = await context.prisma.user({ email })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error("Invalid password")
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user
        }
      }
    })

    t.field("createAttachment", {
      type: "Attachment",
      description: "upload an attachment",
      args: {
        timeline_id: idArg(),
        type: stringArg(),
        url: stringArg()
      },
      resolve: (parent, { timeline_id, type, url }, ctx) => {
        const userId = getUserId(ctx)

        if (!userId) {
          throw new Error("not enough permission")
        }

        return ctx.prisma.createAttachment({
          type: type,
          url,
          timeline: {
            connect: { id: timeline_id }
          }
        })
      }
    })

    t.field("createDraft", {
      type: "Timeline",
      description: "create a time line",
      args: {
        title: stringArg(),
        content: stringArg({ nullable: true })
      },
      resolve: (parent, { title, content }, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.createTimeline({
          title,
          content,
          author: { connect: { id: userId } }
        })
      }
    })

    t.field("scheduleDraft", {
      type: "Boolean",
      description: "schedule create a timeline in future",
      args: {
        title: stringArg(),
        content: stringArg({ nullable: true }),
        date: stringArg()
      },
      resolve: (parent, { title, content, date }, ctx) => {
        const userId = getUserId(ctx)

        var schedule = require("node-schedule")

        schedule.schedule(date, () => {
          ctx.prisma.createTimeline({
            title,
            content,
            author: { connect: { id: userId } }
          })
        })

        return true
      }
    })

    t.field("deleteTimeline", {
      type: "Timeline",
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.deleteTimeline({ id })
      }
    })

    t.field("publish", {
      type: "Timeline",
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.updateTimeline({
          where: { id },
          data: { isPublished: true }
        })
      }
    })

    t.field("likeTimeline", {
      type: "Action",
      args: {
        timeline_id: idArg()
      },
      resolve: (parent, { timeline_id }, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.createAction({
          author: { connect: { id: userId } },
          timeline: { connect: { id: timeline_id } },
          type: "LIKE"
        })
      }
    })

    t.field("shareTimeline", {
      type: "Action",
      args: {
        timeline_id: idArg()
      },
      resolve: (parent, { timeline_id }, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.createAction({
          author: { connect: { id: userId } },
          timeline: { connect: { id: timeline_id } },
          type: "SHARE"
        })
      }
    })

    t.field("commentTimeline", {
      type: "Action",
      args: {
        timeline_id: idArg(),
        content: stringArg()
      },
      resolve: (parent, { timeline_id, content }, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.createAction({
          author: { connect: { id: userId } },
          timeline: { connect: { id: timeline_id } },
          type: "COMMENT",
          content
        })
      }
    })

    t.field("likeComment", {
      type: "Action",
      args: {
        comment_id: idArg(),
        timeline_id: idArg()
      },
      resolve: (parent, { comment_id, timeline_id }, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.createAction({
          author: { connect: { id: userId } },
          comment: { connect: { id: comment_id } },
          timeline: { connect: { id: timeline_id } },
          type: "LIKE"
        })
      }
    })

    t.field("replyComment", {
      type: "Action",
      args: {
        comment_id: idArg(),
        timeline_id: idArg(),
        content: stringArg()
      },
      resolve: (parent, { comment_id, timeline_id, content }, ctx) => {
        const userId = getUserId(ctx)

        if (!userId) {
          throw new Error("not enough permission to update timeline")
        }

        return ctx.prisma.createAction({
          author: { connect: { id: userId } },
          comment: { connect: { id: comment_id } },
          timeline: { connect: { id: timeline_id } },
          type: "COMMENT",
          content
        })
      }
    })

    t.field("mentionUser", {
      type: "Timeline",
      args: {
        timeline_id: idArg(),
        user_id: idArg()
      },
      resolve: async (parent, { timeline_id, user_id }, ctx) => {
        const userId = getUserId(ctx)

        if (!userId) {
          throw new Error("not enough permission")
        }

        return ctx.prisma.updateTimeline({
          where: {
            id: timeline_id
          },
          data: {
            mentions: {
              connect: {
                id: user_id
              }
            }
          }
        })
      }
    })

    t.field("mentionUsers", {
      type: "Timeline",
      args: {
        timeline_id: idArg(),
        list_user_id: idArg({ list: true })
      },
      resolve: async (parent, { timeline_id, list_user_id }, ctx) => {
        const userId = getUserId(ctx)

        if (!userId) {
          throw new Error("not enough permission to update timeline")
        }

        return ctx.prisma.updateTimeline({
          where: {
            id: timeline_id
          },
          data: {
            mentions: {
              connect: list_user_id.map(id => {
                return {
                  id
                }
              })
            }
          }
        })
      }
    })
  }
})
