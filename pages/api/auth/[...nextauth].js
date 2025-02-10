// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/db";
import Candidate from "../../../models/Candidate";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const candidate = await Candidate.findOne({ email: credentials.email });
        if (!candidate) throw new Error("Invalid email or password");

        const isValidPassword = await bcrypt.compare(credentials.password, candidate.password);
        if (!isValidPassword) throw new Error("Invalid email or password");

        return { id: candidate._id, email: candidate.email, name: `${candidate.firstName} ${candidate.lastName}` };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
});
