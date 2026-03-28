"use client"

import { useState, useEffect } from "react"
import { Users, Plus, LogIn, X, Check, Crown, Code, Palette, Database, Cpu } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { subscribe, create, update, COLLECTIONS, orderBy, where } from "@/lib/firestore"

const skillOptions = ["Frontend", "Backend", "ML/AI", "Design", "DevOps", "Mobile"]

const skillIcons: Record<string, any> = {
  Frontend: Code,
  Backend: Database,
  "ML/AI": Cpu,
  Design: Palette,
  DevOps: Database,
  Mobile: Code,
}

export default function TeamPage() {
  const { user, userData } = useAuth()
  const [teams, setTeams] = useState<any[]>([])
  const [view, setView] = useState<"home" | "create" | "join">("home")
  const [teamName, setTeamName] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [joinCode, setJoinCode] = useState("")
  const [joinError, setJoinError] = useState("")

  useEffect(() => {
    const unsub = subscribe(COLLECTIONS.TEAMS, setTeams)
    return () => unsub()
  }, [])

  const myTeam = teams.find((t: any) =>
    t.members?.some((m: any) => m.uid === user?.uid) || t.leaderId === user?.uid
  )
  const availableTeams = teams.filter((t: any) => !t.members || t.members.length < (t.maxMembers ?? 5))

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !user) return
    const code = "HACK" + Math.random().toString(36).substring(2, 6).toUpperCase()
    await create(COLLECTIONS.TEAMS, {
      name: teamName,
      code,
      leaderId: user.uid,
      members: [{ uid: user.uid, name: userData?.displayName ?? "You", role: "Leader", skills: selectedSkills }],
      maxMembers: 5,
      skills: selectedSkills,
      score: 0,
      roundsCleared: 0,
    })
    setTeamName("")
    setSelectedSkills([])
    setView("home")
  }

  const handleJoinByCode = async () => {
    if (!joinCode.trim() || !user) return
    const team = teams.find((t: any) => t.code?.toUpperCase() === joinCode.toUpperCase())
    if (!team) {
      setJoinError("Invalid team code")
      return
    }
    if ((team.members?.length ?? 0) >= (team.maxMembers ?? 5)) {
      setJoinError("Team is full")
      return
    }
    setJoinError("")
    const members = [...(team.members ?? []), { uid: user.uid, name: userData?.displayName ?? "You", role: "Member", skills: [] }]
    await update(COLLECTIONS.TEAMS, team.id, { members })
    setJoinCode("")
    setView("home")
  }

  const handleJoinTeam = async (team: any) => {
    if (!user) return
    const members = [...(team.members ?? []), { uid: user.uid, name: userData?.displayName ?? "You", role: "Member", skills: [] }]
    await update(COLLECTIONS.TEAMS, team.id, { members })
  }

  const handleLeaveTeam = async () => {
    if (!myTeam || !user) return
    const members = (myTeam.members ?? []).filter((m: any) => m.uid !== user.uid)
    await update(COLLECTIONS.TEAMS, myTeam.id, { members })
  }

  // Already in a team
  if (myTeam) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Team</h1>
          <p className="text-muted-foreground mt-1">Manage your team and collaborate</p>
        </div>

        {/* Team Card */}
        <Card className="glass-card border-primary/30 glow-border">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{myTeam.name}</h2>
                  <p className="text-muted-foreground">{myTeam.members?.length ?? 0}/{myTeam.maxMembers ?? 5} members</p>
                </div>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-2">
                <p className="text-sm text-muted-foreground">Invite Code</p>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl border border-border/50">
                  <span className="text-lg font-mono font-bold text-primary tracking-widest">{myTeam.code}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(myTeam.code)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        {myTeam.skills.length > 0 && (
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Team Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {myTeam.skills.map((skill: string) => {
                  const Icon = skillIcons[skill] || Code
                  return (
                    <div key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm text-primary font-medium">{skill}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members */}
        <Card className="glass-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Members
              <span className="text-sm font-normal text-muted-foreground">
                {myTeam.members?.length ?? 0}/{myTeam.maxMembers ?? 5} slots filled
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myTeam.members.map((member: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{(member.name ?? "?")[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{member.name ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{member.role ?? "Member"}</p>
                    </div>
                  </div>
                  {member.role === "Leader" && (
                    <Crown className="w-4 h-4 text-chart-3" />
                  )}
                </div>
              ))}

              {/* Empty slots */}
              {Array((myTeam.maxMembers ?? 5) - (myTeam.members?.length ?? 0)).fill(null).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border/50">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-border/50 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Open slot — share invite code to fill</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={handleLeaveTeam}
        >
          Leave Team
        </Button>
      </div>
    )
  }

  // Create Team view
  if (view === "create") {
    return (
      <div className="space-y-6 max-w-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("home")} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Create a Team</h1>
        </div>

        <Card className="glass-card border-border/50">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Team Name *</label>
              <Input
                placeholder="e.g. Code Wizards"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="h-12 bg-secondary/50 border-border/50 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => {
                  const Icon = skillIcons[skill] || Code
                  const selected = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                        selected
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "bg-secondary/30 border-border/50 text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={handleCreateTeam}
              disabled={!teamName.trim()}
              className="w-full h-12 bg-primary text-primary-foreground rounded-xl font-semibold disabled:opacity-50"
            >
              Create Team
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Join Team view
  if (view === "join") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("home")} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Join a Team</h1>
        </div>

        {/* Join by code */}
        <Card className="glass-card border-border/50 max-w-lg">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Join by Invite Code</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter team code e.g. HACKAB12"
                value={joinCode}
                onChange={(e) => { setJoinCode(e.target.value); setJoinError("") }}
                className="h-12 bg-secondary/50 border-border/50 rounded-xl font-mono uppercase"
              />
              <Button
                onClick={handleJoinByCode}
                className="h-12 px-6 bg-primary text-primary-foreground rounded-xl font-semibold shrink-0"
              >
                Join
              </Button>
            </div>
            {joinError && <p className="text-sm text-destructive">{joinError}</p>}
          </CardContent>
        </Card>

        {/* Browse open teams */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Or Browse Open Teams</h3>
          <div className="space-y-3">
            {availableTeams.map((team) => (
              <Card key={team.id} className="glass-card border-border/50 hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{team.name}</h4>
                        <p className="text-sm text-muted-foreground">{team.members?.length ?? 0}/{team.maxMembers ?? 5} members</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(team.skills ?? []).map((skill: string) => (
                            <span key={skill} className="text-xs px-2 py-0.5 bg-secondary/50 rounded-md text-muted-foreground">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinTeam(team)}
                      size="sm"
                      className="bg-primary text-primary-foreground rounded-lg"
                    >
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Home view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Team Formation</h1>
        <p className="text-muted-foreground mt-1">Create a new team or join an existing one</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-2xl">
        <Card
          onClick={() => setView("create")}
          className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
        >
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Create a Team</h3>
              <p className="text-sm text-muted-foreground mt-1">Start a new team and invite others with a code</p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setView("join")}
          className="glass-card border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
        >
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-chart-2/10 border border-chart-2/20 flex items-center justify-center group-hover:bg-chart-2/20 transition-all">
              <LogIn className="w-8 h-8 text-chart-2" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Join a Team</h3>
              <p className="text-sm text-muted-foreground mt-1">Enter an invite code or browse open teams</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
