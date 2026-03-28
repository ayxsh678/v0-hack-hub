"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Zap, Users, Shield, Radio, ChevronRight } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

import { loginUser, signInWithGoogle } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()

  const [role, setRole] = useState<"admin" | "participant">("admin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    try {
      setLoading(true)

      const selectedRole = role === "admin" ? "admin" : "student"
      const userData = await loginUser(email, password, selectedRole)

      if (role === "admin") {
        router.push("/admin")
      } else if (role === "participant") {
        router.push("/student")
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError("")

      const selectedRole = role === "admin" ? "admin" : "student"
      const userData = await signInWithGoogle(selectedRole)

      if (selectedRole === "admin") {
        router.push("/admin")
      } else {
        router.push("/student")
      }
    } catch (error) {
      console.error("Google sign-in failed:", error)
      setError("Google sign-in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Radio,
      title: "Real-time Coordination",
      description: "Instant communication across all teams and volunteers",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless team management and participant tracking",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Role-based permissions with enterprise-grade security",
    },
  ]

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        </div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(oklch(0.65 0.2 155 / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(0.65 0.2 155 / 0.3) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-emerald">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">HackHub</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6 text-balance">
            Streamline Your Hackathon Operations
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-md">
            The all-in-one platform for organizing, managing, and running successful hackathons with powerful tools for coordinators and participants.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-emerald">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HackHub</span>
          </div>

          <div className="glass-card rounded-2xl p-8 glow-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground">Sign in to access your dashboard</p>
            </div>

            <div className="flex p-1 bg-secondary/50 rounded-xl mb-8">
              <button
                type="button"
                onClick={() => {
                  setRole("admin")
                  setError("")
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  role === "admin"
                    ? "bg-primary text-primary-foreground shadow-lg glow-emerald"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin / Manager
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("participant")
                  setError("")
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  role === "participant"
                    ? "bg-primary text-primary-foreground shadow-lg glow-emerald"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Volunteer / Participant
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-secondary/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl btn-glow transition-all duration-300 group disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && (
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-12 border-border/50 bg-secondary/30 hover:bg-secondary/50 rounded-xl transition-all duration-300"
              >
                <FcGoogle className="mr-3 h-5 w-5" />
                {loading ? "Please wait..." : "Sign in with Google"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground mb-4">
                {"Don't have an account yet?"}
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-xl transition-all duration-300"
              >
                Request Access
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}