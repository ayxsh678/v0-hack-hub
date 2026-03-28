"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Clock, MapPin, Users, Edit2, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { subscribe, remove, COLLECTIONS } from "@/lib/firestore"
import { orderBy } from "firebase/firestore"

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState("Day 1")

  useEffect(() => {
    const unsub = subscribe(COLLECTIONS.SCHEDULE, setScheduleData, orderBy("startTime", "asc"))
    return () => unsub()
  }, [])

  const handleDelete = async (id: string) => {
    await remove(COLLECTIONS.SCHEDULE, id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "border-l-chart-2"
      case "active": return "border-l-primary"
      case "upcoming": return "border-l-muted-foreground"
      default: return "border-l-border"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-chart-2" />
      case "active": return <Clock className="w-5 h-5 text-primary animate-pulse" />
      case "upcoming": return <AlertCircle className="w-5 h-5 text-muted-foreground" />
      default: return null
    }
  }

  const completedCount = scheduleData.filter(e => e.status === "completed").length
  const activeCount = scheduleData.filter(e => e.status === "active").length
  const upcomingCount = scheduleData.filter(e => e.status === "upcoming").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Event Schedule</h1>
          <p className="text-muted-foreground mt-1">Manage and track event timeline</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingCount}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2">
        {["Day 1", "Day 2", "Day 3"].map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            onClick={() => setSelectedDay(day)}
            className={selectedDay === day ? "bg-primary text-primary-foreground" : "border-border/50"}
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Timeline */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            {selectedDay} Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleData.map((event, index) => (
              <div
                key={event.id}
                className={`relative pl-6 border-l-4 ${getStatusColor(event.status)} rounded-r-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200`}
              >
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(event.status)}
                        <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {event.startTime ? new Date(event.startTime).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"}) : event.time} - {event.endTime ? new Date(event.endTime).toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"}) : ""}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {event.attendees} expected
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
