"use client"

import { useState, useEffect } from "react"
import { Bell, Search, AlertTriangle, Info, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { subscribe, COLLECTIONS, formatTimestamp, orderBy } from "@/lib/firestore"

export default function UpdatesPage() {
  const [updatesData, setUpdatesData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  useEffect(() => {
    const unsub = subscribe(COLLECTIONS.ANNOUNCEMENTS, setUpdatesData, orderBy("createdAt", "desc"))
    return () => unsub()
  }, [])

  const filteredUpdates = updatesData.filter(update => {
    const matchesSearch = (update.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (update.message ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterPriority === "all" || update.priority === filterPriority
    return matchesSearch && matchesFilter
  })

  const unreadCount = updatesData.filter(u => !u.read).length
  const urgentCount = updatesData.filter(u => u.priority === "urgent").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Updates & Announcements</h1>
        <p className="text-muted-foreground mt-1">Stay informed about the latest hackathon news</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{urgentCount}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          {["all", "urgent", "info"].map((priority) => (
            <Button
              key={priority}
              variant={filterPriority === priority ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPriority(priority)}
              className={filterPriority === priority ? "bg-primary text-primary-foreground" : "border-border/50"}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <Card 
            key={update.id} 
            className={`glass-card border-border/50 hover:border-primary/30 transition-all duration-300 ${
              !update.read ? "border-l-4 border-l-primary" : ""
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  update.priority === "urgent" ? "bg-destructive/10" : "bg-primary/10"
                }`}>
                  {update.priority === "urgent" ? (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  ) : (
                    <Info className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{update.title}</h3>
                      {!update.read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-lg shrink-0">
                      {update.category ?? "General"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{update.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(update.createdAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
