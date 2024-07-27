export const runtime = 'nodejs'

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { comparePwd } from "./lib/cryptoUtils"
import { signInSchema } from "./lib/zod"
import { redirect } from "next/navigation"

export const { handlers, signIn, signOut, auth } = NextAuth({
      providers: [
        Credentials({
            credentials: {
                username: {},
                password: {}
            },
            authorize: async(credentials) => {
                let user = null

                const { email, password } = await signInSchema.parseAsync(credentials)
                // const pwdHash = await (password)
                // user = await User.findOne({email: email}).exec()
                let userReq = await fetch("/api/user/get", {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email
                    })
                })
                user = await userReq.json()
                // console.log(user1)
                if(!user) {
                    throw new Error("UNF")
                }
                let correct = await comparePwd(password, user.password);
                if(!correct) {
                    user = null
                }
                return user
            }
        })
    ],
    callbacks : {
        async jwt({user, token}) {
            if(user) {
                token.user = user
            }
            return token
        },
        async session({session, token} : any) {
            session.user = token.user;
            return session
        }
    },
    trustHost: true
})
