"use client"

import { useState, useEffect } from "react"
import { Trophy, Search, Medal, TrendingUp, TrendingDown, Users, Award, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { subscribe, COLLECTIONS, orderBy } from "@/lib/firestore"

export default function StudentLeaderboardPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const unsub = subscribe(COLLECTIONS.TEAMS, setTeams, orderBy("score", "desc"))
    return () => unsub()
  }, [])

  const leaderboardData = teams.map((t, i) => ({
    rank: i + 1,
    team: t.name ?? "Unnamed",
    score: t.score ?? 0,
    members: t.members?.length ?? 0,
    change: t.rankChange ?? 0,
    category: t.category ?? "General",
    isYourTeam: t.members?.some((m: any) => m.uid === user?.uid) || t.leaderId === user?.uid,
  }))

  const filteredTeams = leaderboardData.filter(team =>
    team.team.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const yourTeam = leaderboardData.find(t => t.isYourTeam)

  const getRankStyle = (rank: number, isYourTeam: boolean) => {
    if (isYourTeam) {
      return { bg: "bg-primary/20", border: "border-primary/50", text: "text-primary" }
    }
    switch (rank) {
      case 1: return { bg: "bg-chart-3/20", border: "border-chart-3/50", text: "text-chart-3" }
      case 2: return { bg: "bg-muted/50", border: "border-muted-foreground/30", text: "text-muted-foreground" }
      case 3: return { bg: "bg-chart-5/20", border: "border-chart-5/50", text: "text-chart-5" }
      default: return { bg: "bg-secondary/50", border: "border-border/50", text: "text-foreground" }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">See how your team ranks against others</p>
      </div>

      {/* Your Team Highlight */}
      {yourTeam && (
        <Card className="glass-card border-primary/30 glow-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-chart-3/20 border-2 border-chart-3/50 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-chart-3" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-foreground">{yourTeam.team}</h2>
                    <Star className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <p className="text-muted-foreground">Your Team</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-lg">{yourTeam.category}</span>
                    <span className="text-xs text-muted-foreground">{yourTeam.members} members</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-chart-3">#{yourTeam.rank}</div>
                  <p className="text-xs text-muted-foreground">Current Rank</p>
                </div>
                <div className="h-16 w-px bg-border hidden md:block" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{yourTeam.score}</div>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Second Place */}
        <Card className="glass-card border-muted-foreground/30 order-2 md:order-1 md:mt-8">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 border-2 border-muted-foreground/30 flex items-center justify-center mb-4">
              <Medal className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-muted-foreground mb-1">2nd</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{leaderboardData[1].team}</h3>
            <div className="text-2xl font-bold text-foreground">{leaderboardData[1].score}</div>
            <p className="text-xs text-muted-foreground">points</p>
          </CardContent>
        </Card>

        {/* First Place */}
        <Card className={`glass-card order-1 md:order-2 ${leaderboardData[0].isYourTeam ? "border-primary/50 glow-border" : "border-chart-3/50"}`}>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-chart-3/20 border-2 border-chart-3/50 flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-chart-3" />
            </div>
            <div className="text-4xl font-bold text-chart-3 mb-1">1st</div>
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {leaderboardData[0].team}
              {leaderboardData[0].isYourTeam && (
                <Star className="w-4 h-4 text-primary fill-primary inline ml-2" />
              )}
            </h3>
            <div className="text-3xl font-bold text-primary">{leaderboardData[0].score}</div>
            <p className="text-xs text-muted-foreground">points</p>
          </CardContent>
        </Card>

        {/* Third Place */}
        <Card className="glass-card border-chart-5/50 order-3 md:mt-12">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-chart-5/20 border-2 border-chart-5/50 flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-chart-5" />
            </div>
            <div className="text-2xl font-bold text-chart-5 mb-1">3rd</div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{leaderboardData[2].team}</h3>
            <div className="text-2xl font-bold text-foreground">{leaderboardData[2].score}</div>
            <p className="text-xs text-muted-foreground">points</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary/50 border-border/50 rounded-xl"
        />
      </div>

      {/* Full Leaderboard */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-chart-4" />
            </div>
            All Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTeams.map((team) => {
              const style = getRankStyle(team.rank, team.isYourTeam)
              return (
                <div
                  key={team.rank}
                  className={`flex items-center justify-between p-4 rounded-xl ${style.bg} border ${style.border} hover:scale-[1.01] transition-all duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${style.text}`}>
                      {team.rank <= 3 ? (
                        team.rank === 1 ? <Trophy className="w-5 h-5" /> :
                        team.rank === 2 ? <Medal className="w-5 h-5" /> :
                        <Award className="w-5 h-5" />
                      ) : (
                        <span>{team.rank}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{team.team}</h3>
                        {team.isYourTeam && (
                          <Star className="w-4 h-4 text-primary fill-primary" />
                        )}
                        <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                          {team.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{team.members} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      {team.change > 0 && <TrendingUp className="w-4 h-4 text-chart-2" />}
                      {team.change < 0 && <TrendingDown className="w-4 h-4 text-destructive" />}
                      {team.change !== 0 && (
                        <span className={`text-xs ${team.change > 0 ? "text-chart-2" : "text-destructive"}`}>
                          {team.change > 0 ? "+" : ""}{team.change}
                        </span>
                      )}
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-bold text-primary">{team.score}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
