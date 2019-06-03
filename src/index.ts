import * as path from "path"
import * as allTypes from "./resolvers"
import { makePrismaSchema } from "nexus-prisma"
import { ApolloServer } from "apollo-server"
import datamodelInfo from "./generated/nexus-prisma"
import { prisma } from "./generated/prisma-client"

import { RedisCache } from "apollo-server-cache-redis"

// import {getUser} from "./utils"

const schema = makePrismaSchema({
  types: allTypes,

  // Configure the interface to Prisma
  prisma: {
    datamodelInfo,
    client: prisma
  },

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts")
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: false,
    output: false
  },

  // Configure automatic type resolution for the TS representations of the associated types
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, "./types.ts"),
        alias: "types"
      }
    ],
    contextType: "types.Context"
  }
})

const server = new ApolloServer({
  schema,
  context: req => {
    return {
      ...req,
      prisma
    }
  },
  // cacheControl: {
  //     defaultMaxAge: 1000
  // }
  // plugins: [responseCachePlugin()],
  cache: new RedisCache({
    host: "redis"
  }),
  engine: {
    apiKey: process.env.ENGINE_API_KEY
  }
})

const port = process.env.PORT || 4000

server.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`)
)
