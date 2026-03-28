"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError("Invalid email or password")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="p-8 border rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Login to HackHub</h2>
        {error && (
          <p className="text-red-500 mb-4 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}
        <input
          className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  )
}
