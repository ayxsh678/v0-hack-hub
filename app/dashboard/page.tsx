import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/auth/login")

  const role = (session.user as any)?.role

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome, {session.user?.email}</p>
      <div className="inline-block px-3 py-1 bg-black text-white text-sm rounded-full">
        Role: {role}
      </div>
    </div>
  )
}
