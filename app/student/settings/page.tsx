"use client"

import { useState } from "react"
import { Settings, Bell, Shield, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { update, COLLECTIONS } from "@/lib/firestore"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"

export default function StudentSettingsPage() {
  const { user, userData } = useAuth()
  const [activeTab, setActiveTab] = useState("notifications")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  const handleChangePassword = async () => {
    setPasswordError("")
    setPasswordSuccess("")
    if (!user || !currentPassword || !newPassword) return
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      setPasswordSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setPasswordError("Current password is incorrect")
    }
  }

  const handleSaveNotifications = async () => {
    // Notification preferences can be stored on user doc
    if (!user) return
    await update(COLLECTIONS.USERS, user.uid, { notificationsUpdated: true })
  }

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
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
                  { label: "Announcement Alerts", description: "Get notified about new announcements", default: true },
                  { label: "Team Updates", description: "Notifications about team activities", default: true },
                  { label: "Schedule Reminders", description: "Reminders for upcoming events", default: true },
                  { label: "Leaderboard Changes", description: "Updates when rankings change", default: true },
                  { label: "Query Responses", description: "Notifications when your queries are answered", default: true },
                  { label: "Email Notifications", description: "Receive updates via email", default: false }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Checkbox defaultChecked={item.default} className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
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
                      <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
                      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-secondary/50 border-border/50 rounded-xl" />
                    </div>
                    {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                    {passwordSuccess && <p className="text-sm text-chart-2">{passwordSuccess}</p>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleChangePassword} className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
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
        </div>
      </div>
    </div>
  )
}
