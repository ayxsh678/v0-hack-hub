"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Users2,
  DoorOpen,
  Wallet,
  Mic,
  MicOff,
  Calendar,
  AlertCircle,
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { subscribe, COLLECTIONS, formatTimestamp } from "@/lib/firestore"
import { orderBy, where } from "firebase/firestore"

export default function AdminDashboard() {
  const [isPTTActive, setIsPTTActive] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [budgetCategories, setBudgetCategories] = useState<any[]>([])
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [volunteers, setVolunteers] = useState<any[]>([])

  useEffect(() => {
    const unsubs = [
      subscribe(COLLECTIONS.USERS, setParticipants, where("role", "==", "student")),
      subscribe(COLLECTIONS.TEAMS, setTeams, orderBy("score", "desc")),
      subscribe(COLLECTIONS.ROOMS, setRooms),
      subscribe(COLLECTIONS.BUDGET_CATEGORIES, setBudgetCategories),
      subscribe(COLLECTIONS.SCHEDULE, setScheduleEvents, orderBy("startTime", "asc")),
      subscribe(COLLECTIONS.ANNOUNCEMENTS, setAnnouncements, orderBy("createdAt", "desc")),
      subscribe(COLLECTIONS.VOLUNTEERS, setVolunteers),
    ]
    return () => unsubs.forEach((u) => u())
  }, [])

  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length
  const totalRooms = rooms.length || 1
  const totalBudget = budgetCategories.reduce((s, c) => s + (c.allocated || 0), 0)
  const usedBudget = budgetCategories.reduce((s, c) => s + (c.spent || 0), 0)

  const statsCards = [
    {
      title: "Total Participants",
      value: String(participants.length),
      change: "",
      trend: "neutral" as const,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Teams",
      value: String(teams.length),
      change: "",
      trend: "neutral" as const,
      icon: Users2,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Rooms Occupied",
      value: `${occupiedRooms}/${totalRooms}`,
      change: `${Math.round((occupiedRooms / totalRooms) * 100)}%`,
      trend: "neutral" as const,
      icon: DoorOpen,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Budget Used",
      value: `$${usedBudget.toLocaleString()}`,
      change: totalBudget ? `${Math.round((usedBudget / totalBudget) * 100)}%` : "0%",
      trend: "neutral" as const,
      icon: Wallet,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  const leaderboardData = teams.slice(0, 5).map((t, i) => ({
    rank: i + 1,
    team: t.name,
    score: t.score ?? 0,
    members: t.members?.length ?? 0,
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your hackathon event</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="w-4 h-4 text-primary" />}
                  {stat.trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                  <span className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-primary" : stat.trend === "down" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Walkie Talkie */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary" />
              </div>
              Walkie Talkie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPTTActive 
                    ? "bg-primary glow-emerald" 
                    : "bg-secondary/50 border-2 border-border/50"
                }`}>
                  {isPTTActive ? (
                    <Mic className="w-12 h-12 text-primary-foreground" />
                  ) : (
                    <MicOff className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                {isPTTActive && (
                  <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                )}
              </div>
              <Button
                size="lg"
                className={`w-full h-14 rounded-xl font-semibold transition-all duration-300 ${
                  isPTTActive 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground btn-glow" 
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
                onMouseDown={() => setIsPTTActive(true)}
                onMouseUp={() => setIsPTTActive(false)}
                onMouseLeave={() => setIsPTTActive(false)}
                onTouchStart={() => setIsPTTActive(true)}
                onTouchEnd={() => setIsPTTActive(false)}
              >
                {isPTTActive ? "Broadcasting..." : "Hold to Talk"}
              </Button>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Broadcasting to all volunteers on channel 1
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Event Schedule */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-chart-3" />
              </div>
              Event Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduleEvents.slice(0, 6).map((event, index) => {
                const status = event.status || "upcoming"
                const time = event.startTime ? new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : ""
                return (
                  <div
                    key={event.id || index}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                      status === "active" 
                        ? "bg-primary/10 border border-primary/30" 
                        : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      {status === "completed" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      {status === "active" && <Clock className="w-4 h-4 text-primary animate-pulse" />}
                      {status === "upcoming" && <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        status === "completed" ? "text-muted-foreground" : "text-foreground"
                      }`}>
                        {event.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{time}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-chart-5" />
              </div>
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.slice(0, 4).map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium shrink-0 ${
                      announcement.priority === "urgent" 
                        ? "bg-destructive/20 text-destructive" 
                        : "bg-primary/20 text-primary"
                    }`}>
                      {announcement.priority || "info"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(announcement.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volunteer Updates */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-chart-2" />
              </div>
              Volunteer Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {volunteers.slice(0, 4).map((volunteer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {volunteer.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{volunteer.name}</p>
                      <p className="text-xs text-muted-foreground">{volunteer.role} • {volunteer.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Round {volunteer.round}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      volunteer.status === "active" ? "bg-primary" : "bg-chart-3"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-chart-4" />
              </div>
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboardData.map((team) => (
                <div
                  key={team.rank}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    team.rank <= 3 
                      ? "bg-primary/5 border border-primary/20 hover:border-primary/40" 
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      team.rank === 1 ? "bg-chart-3/20 text-chart-3" :
                      team.rank === 2 ? "bg-muted text-muted-foreground" :
                      team.rank === 3 ? "bg-chart-5/20 text-chart-5" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {team.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{team.team}</p>
                      <p className="text-xs text-muted-foreground">{team.members} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{team.score}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
