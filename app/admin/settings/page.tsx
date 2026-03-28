"use client"

import { useState, useEffect } from "react"
import { Settings, User, Bell, Shield, Palette, Globe, Save, Camera, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { update, subscribeDoc, COLLECTIONS } from "@/lib/firestore"
import { seedFirestore } from "@/lib/seed"

export default function SettingsPage() {
  const { user, userData } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [eventSettings, setEventSettings] = useState<any>(null)
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [eventName, setEventName] = useState("")
  const [venue, setVenue] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    const unsub = subscribeDoc(COLLECTIONS.EVENT_SETTINGS, "current", (data) => {
      setEventSettings(data)
      if (data) {
        setEventName(data.name || "")
        setVenue(data.venue || "")
        setStartDate(data.startDate || "")
        setEndDate(data.endDate || "")
      }
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (userData) {
      setProfileName(userData.name || "")
      setProfileEmail(userData.email || user?.email || "")
    }
  }, [userData, user])

  const handleSaveProfile = async () => {
    if (user?.uid) {
      await update(COLLECTIONS.USERS, user.uid, { name: profileName, email: profileEmail })
    }
  }

  const handleSaveEvent = async () => {
    await update(COLLECTIONS.EVENT_SETTINGS, "current", {
      name: eventName,
      venue,
      startDate,
      endDate,
    })
  }

  const handleSeed = async () => {
    setSeeding(true)
    try { await seedFirestore() } finally { setSeeding(false) }
  }

  const displayName = userData?.name || user?.displayName || "Admin"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "event", label: "Event Settings", icon: Globe },
    { id: "database", label: "Database", icon: Database }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and event preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="glass-card border-border/50 lg:col-span-1 h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{initials}</span>
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground mb-2">JPG, PNG or GIF. Max size 2MB.</p>
                    <Button variant="outline" size="sm" className="border-border/50">
                      Upload New Photo
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                    <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                    <Input defaultValue="Event Manager" className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                    <Input defaultValue="+1 (555) 000-0000" className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
                  <textarea
                    defaultValue="Experienced event manager with 5+ years of hackathon organization."
                    rows={3}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-chart-3" />
                  </div>
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Push Notifications", description: "Receive push notifications on your device" },
                  { label: "Email Notifications", description: "Receive updates via email" },
                  { label: "Issue Alerts", description: "Get notified when new issues are reported" },
                  { label: "Volunteer Updates", description: "Updates about volunteer status changes" },
                  { label: "Budget Alerts", description: "Alerts when budget thresholds are reached" },
                  { label: "Schedule Changes", description: "Notifications for schedule modifications" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Checkbox defaultChecked={index < 4} className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-chart-4" />
                  </div>
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
                      <Input type="password" className="bg-secondary/50 border-border/50 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
                      <Input type="password" className="bg-secondary/50 border-border/50 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
                      <Input type="password" className="bg-secondary/50 border-border/50 rounded-xl" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-chart-5" />
                  </div>
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Theme</h4>
                  <div className="flex gap-4">
                    <button className="p-4 rounded-xl border-2 border-primary bg-primary/10 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-border" />
                      <span className="text-sm font-medium text-foreground">Dark</span>
                    </button>
                    <button className="p-4 rounded-xl border border-border/50 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                      <div className="w-12 h-12 rounded-lg bg-white border border-border" />
                      <span className="text-sm text-muted-foreground">Light</span>
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-4">Accent Color</h4>
                  <div className="flex gap-3">
                    {["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"].map((color, index) => (
                      <button
                        key={index}
                        className={`w-10 h-10 rounded-full ${color} ${index === 0 ? "ring-2 ring-offset-2 ring-offset-background ring-primary" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "event" && (
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-chart-2" />
                  </div>
                  Event Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Event Name</label>
                    <Input value={eventName} onChange={(e) => setEventName(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Venue</label>
                    <Input value={venue} onChange={(e) => setVenue(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Start Date</label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">End Date</label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveEvent} className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
