import { verify } from "jsonwebtoken"
import { Context } from "./types"

export const APP_SECRET = "appsecret321"

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  // const Authorization = context.request.get('Authorization')
  const Authorization = context.req.headers.authorization
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "")
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && verifiedToken.userId
  }
}

// export function getUser(context: Context) {
//     const Authorization = context.req.get('Authorization')
//     if (Authorization) {
//         const token = Authorization.replace('Bearer ', '')
//         const verifiedToken = verify(token, APP_SECRET) as Token
//         const userId = verifiedToken && verifiedToken.userId
//         return prisma.user({id: userId})
//     }
// }

// export function getUser(tokenString: string) {
//         const verifiedToken = verify(tokenString, APP_SECRET) as Token
//         const userId = verifiedToken && verifiedToken.userId
//         return prisma.user({id: userId})
// }
