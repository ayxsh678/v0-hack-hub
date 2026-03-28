"use client"

import { useState, useEffect } from "react"
import { Trophy, Search, Medal, TrendingUp, TrendingDown, Users, Star, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { subscribe, COLLECTIONS } from "@/lib/firestore"
import { orderBy } from "firebase/firestore"

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  useEffect(() => {
    const unsub = subscribe(COLLECTIONS.TEAMS, setTeams, orderBy("score", "desc"))
    return () => unsub()
  }, [])

  const leaderboardData = teams.map((t, i) => ({
    rank: i + 1,
    team: t.name,
    score: t.score ?? 0,
    members: t.members?.length ?? 0,
    change: 0,
    category: t.category || "General",
    projectName: t.projectName || "",
    id: t.id,
  }))

  const categories = ["all", ...new Set(leaderboardData.map(t => t.category))]

  const filteredTeams = leaderboardData.filter(team => {
    const matchesSearch = team.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterCategory === "all" || team.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return { bg: "bg-chart-3/20", border: "border-chart-3/50", text: "text-chart-3", icon: "text-chart-3" }
      case 2: return { bg: "bg-muted/50", border: "border-muted-foreground/30", text: "text-muted-foreground", icon: "text-muted-foreground" }
      case 3: return { bg: "bg-chart-5/20", border: "border-chart-5/50", text: "text-chart-5", icon: "text-chart-5" }
      default: return { bg: "bg-secondary/50", border: "border-border/50", text: "text-foreground", icon: "text-muted-foreground" }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Track team rankings and scores</p>
      </div>

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
            <p className="text-sm text-muted-foreground mb-2">{leaderboardData[1].projectName}</p>
            <div className="text-2xl font-bold text-foreground">{leaderboardData[1].score}</div>
            <p className="text-xs text-muted-foreground">points</p>
          </CardContent>
        </Card>

        {/* First Place */}
        <Card className="glass-card border-chart-3/50 order-1 md:order-2 glow-border">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-chart-3/20 border-2 border-chart-3/50 flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-chart-3" />
            </div>
            <div className="text-4xl font-bold text-chart-3 mb-1">1st</div>
            <h3 className="text-xl font-semibold text-foreground mb-1">{leaderboardData[0].team}</h3>
            <p className="text-sm text-muted-foreground mb-2">{leaderboardData[0].projectName}</p>
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
            <p className="text-sm text-muted-foreground mb-2">{leaderboardData[2].projectName}</p>
            <div className="text-2xl font-bold text-foreground">{leaderboardData[2].score}</div>
            <p className="text-xs text-muted-foreground">points</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 5).map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(category)}
              className={filterCategory === category ? "bg-primary text-primary-foreground" : "border-border/50"}
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
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
              const style = getRankStyle(team.rank)
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
                        <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                          {team.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{team.projectName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {team.members}
                    </div>
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
