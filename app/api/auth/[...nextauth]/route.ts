import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const users = [
          { id: "1", email: "admin@test.com", password: "1234", role: "ORGANIZER" },
          { id: "2", email: "user@test.com", password: "1234", role: "PARTICIPANT" },
        ]

        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )

        if (!user) return null
        return { id: user.id, email: user.email, role: user.role }
      },
    }),
  ],
  pages: { signIn: "/" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
