"use client"

import { useEffect, useState } from "react"
import {
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  MessageSquare,
  QrCode,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { subscribe, subscribeDoc, COLLECTIONS, formatTimestamp, orderBy } from "@/lib/firestore"

const quickActions = [
  { icon: MessageSquare, label: "Submit Query", href: "/student/queries", color: "bg-primary/10 text-primary" },
  { icon: QrCode, label: "View QR Code", href: "/student/qr", color: "bg-chart-2/10 text-chart-2" },
  { icon: Trophy, label: "Leaderboard", href: "/student/leaderboard", color: "bg-chart-3/10 text-chart-3" },
  { icon: Users, label: "My Team", href: "/student/team", color: "bg-chart-4/10 text-chart-4" }
]

export default function StudentDashboard() {
  const { user, userData } = useAuth()
  const [teams, setTeams] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([])
  const [eventSettings, setEventSettings] = useState<any>(null)

  useEffect(() => {
    const unsubs = [
      subscribe(COLLECTIONS.TEAMS, setTeams, orderBy("score", "desc")),
      subscribe(COLLECTIONS.ANNOUNCEMENTS, setAnnouncements, orderBy("createdAt", "desc")),
      subscribe(COLLECTIONS.SCHEDULE, setScheduleEvents, orderBy("startTime", "asc")),
      subscribeDoc(COLLECTIONS.EVENT_SETTINGS, "main", setEventSettings),
    ]
    return () => unsubs.forEach((u) => u())
  }, [])

  const myTeam = teams.find((t: any) =>
    t.members?.some((m: any) => m.uid === user?.uid) || t.leaderId === user?.uid
  )
  const myRank = myTeam ? teams.indexOf(myTeam) + 1 : "-"
  const totalTeams = teams.length

  const statsCards = [
    {
      title: "Current Rank",
      value: myTeam ? `#${myRank}` : "-",
      subtitle: `Out of ${totalTeams} teams`,
      icon: Trophy,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10"
    },
    {
      title: "Team Status",
      value: myTeam ? "Active" : "No Team",
      subtitle: myTeam ? `${myTeam.members?.length ?? 0} members` : "Join or create a team",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Rounds Cleared",
      value: `${myTeam?.roundsCleared ?? 0}/${eventSettings?.totalRounds ?? 4}`,
      subtitle: "Keep going!",
      icon: CheckCircle2,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10"
    },
    {
      title: "Current Round",
      value: `Round ${eventSettings?.currentRound ?? 1}`,
      subtitle: eventSettings?.roundName ?? "",
      icon: Clock,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10"
    }
  ]

  const firstName = userData?.displayName?.split(" ")[0] ?? "there"
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card rounded-2xl p-6 glow-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Welcome back, {firstName}!</h1>
            <p className="text-muted-foreground mt-1">
              {"You're doing great! Keep up the excellent work with your team."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Team</p>
              <p className="text-lg font-semibold text-primary">{myTeam?.name ?? "No Team"}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>
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
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground/70">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-foreground">{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Important Updates */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-chart-5" />
                </div>
                Important Updates
              </CardTitle>
              <Link href="/student/updates">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.slice(0, 4).map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 ${
                      announcement.priority === "urgent" ? "text-destructive" : "text-primary"
                    }`}>
                      {announcement.priority === "urgent" ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
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

        {/* Event Timeline */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-chart-3" />
              </div>
              Event Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduleEvents.map((event, index) => {
                const now = new Date()
                const start = event.startTime ? new Date(event.startTime) : null
                const end = event.endTime ? new Date(event.endTime) : null
                const status = end && now > end ? "completed" : start && now >= start && (!end || now <= end) ? "active" : "upcoming"
                const timeStr = start ? start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""
                return (
                <div
                  key={index}
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
                  <span className="text-xs text-muted-foreground shrink-0">{timeStr}</span>
                </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Leaderboard Preview */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-chart-4" />
              </div>
              Your Position
            </CardTitle>
            <Link href="/student/leaderboard">
              <Button variant="ghost" size="sm" className="text-primary">
                Full Leaderboard
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-chart-3/20 border border-chart-3/50 flex items-center justify-center">
                <span className="text-xl font-bold text-chart-3">#{myRank}</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{myTeam?.name ?? "No Team"}</h3>
                <p className="text-sm text-muted-foreground">Your Team</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{myTeam?.score ?? 0}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
