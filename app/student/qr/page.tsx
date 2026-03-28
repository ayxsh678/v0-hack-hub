"use client"

import { useEffect, useState } from "react"
import { QrCode, Download, Share2, RefreshCw, CheckCircle2, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { subscribe, COLLECTIONS, formatTimestamp, orderBy, where } from "@/lib/firestore"

export default function QRPage() {
  const { user, userData } = useAuth()
  const [teams, setTeams] = useState<any[]>([])
  const [accessHistory, setAccessHistory] = useState<any[]>([])

  useEffect(() => {
    const unsubs = [
      subscribe(COLLECTIONS.TEAMS, setTeams),
    ]
    return () => unsubs.forEach((u) => u())
  }, [])

  const myTeam = teams.find((t: any) =>
    t.members?.some((m: any) => m.uid === user?.uid) || t.leaderId === user?.uid
  )
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">QR Access</h1>
        <p className="text-muted-foreground mt-1">Your digital access pass for the hackathon</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <Card className="glass-card border-primary/30 glow-border">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-lg">Your Access QR Code</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* QR Code Placeholder */}
            <div className="w-64 h-64 bg-white rounded-2xl p-4 mb-6 flex items-center justify-center">
              <div className="w-full h-full relative">
                {/* Simulated QR Code Pattern */}
                <div className="absolute inset-0 grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${
                        Math.random() > 0.5 ? "bg-background" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                {/* Corner patterns */}
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-background rounded-lg" />
                <div className="absolute top-0 right-0 w-12 h-12 border-4 border-background rounded-lg" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-4 border-background rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground">{userData?.displayName ?? "Student"}</h3>
              <p className="text-muted-foreground">Team {myTeam?.name ?? "No Team"}</p>
              <p className="text-xs text-primary mt-2">ID: {user?.uid?.substring(0, 12) ?? "N/A"}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-border/50">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="border-border/50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="border-border/50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Information */}
        <div className="space-y-6">
          {/* Access Status */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-chart-2" />
                </div>
                Access Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-chart-2/10 border border-chart-2/30">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-chart-2 animate-pulse" />
                    <span className="font-medium text-foreground">All Areas Access</span>
                  </div>
                  <span className="text-sm text-chart-2">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <p className="text-2xl font-bold text-foreground">5</p>
                    <p className="text-xs text-muted-foreground">Check-ins Today</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <p className="text-2xl font-bold text-foreground">Lab 1</p>
                    <p className="text-xs text-muted-foreground">Last Location</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access History */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-chart-3" />
                </div>
                Access History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessHistory.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      index === 0 ? "bg-primary/10 border border-primary/30" : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        index === 0 ? "bg-primary/20" : "bg-secondary"
                      }`}>
                        <MapPin className={`w-4 h-4 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{entry.location}</p>
                        <p className="text-xs text-muted-foreground">{entry.status === "entry" ? "Checked in" : "Checked out"}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{entry.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-4">How to Use Your QR Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Show at Entry</p>
                <p className="text-sm text-muted-foreground">Present your QR code at any access point to enter restricted areas.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Keep it Handy</p>
                <p className="text-sm text-muted-foreground">Download the QR code to your phone for quick access.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">{"Don't Share"}</p>
                <p className="text-sm text-muted-foreground">Your QR code is personal. Do not share it with others.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
