import NextAuth from "next-auth"

declare module "next-auth" {
    interface User {
        userType?: string
    }

    interface Session {
        user?: User
    }
}