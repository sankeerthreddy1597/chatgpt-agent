import { betterAuth } from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from "@/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: String(process.env.GITHUB_CLIENT_ID),
            clientSecret: String(process.env.GITHUB_CLIENT_SECRET)
        },
        google: {
            clientId: String(process.env.GOOGLE_CLIENT_ID),
            clientSecret: String(process.env.GOOGLE_CLIENT_SECRET)
        }
    },
    account: {
        accountLinking: {
            enabled: false
        }
    }
});