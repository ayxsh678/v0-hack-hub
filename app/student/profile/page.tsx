"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Github, Linkedin, Globe, Camera, Save, MapPin, Briefcase, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { update, COLLECTIONS } from "@/lib/firestore"

export default function ProfilePage() {
  const { user, userData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    university: "",
    major: "",
    year: "",
    location: "",
    github: "",
    linkedin: "",
    website: "",
    bio: "",
    skills: [] as string[]
  })

  useEffect(() => {
    if (userData) {
      const [first = "", ...rest] = (userData.displayName ?? "").split(" ")
      setProfile({
        firstName: first,
        lastName: rest.join(" "),
        email: userData.email ?? user?.email ?? "",
        phone: userData.phone ?? "",
        university: userData.university ?? "",
        major: userData.major ?? "",
        year: userData.year ?? "",
        location: userData.location ?? "",
        github: userData.github ?? "",
        linkedin: userData.linkedin ?? "",
        website: userData.website ?? "",
        bio: userData.bio ?? "",
        skills: userData.skills ?? [],
      })
    }
  }, [userData, user])

  const handleSave = async () => {
    if (!user) return
    await update(COLLECTIONS.USERS, user.uid, {
      displayName: `${profile.firstName} ${profile.lastName}`.trim(),
      phone: profile.phone,
      university: profile.university,
      major: profile.major,
      year: profile.year,
      location: profile.location,
      github: profile.github,
      linkedin: profile.linkedin,
      website: profile.website,
      bio: profile.bio,
      skills: profile.skills,
    })
    setIsEditing(false)
  }

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase() || "?"

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your personal information</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className={!isEditing ? "bg-primary hover:bg-primary/90 text-primary-foreground btn-glow" : "border-border/50"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="glass-card border-border/50 lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto">
                <span className="text-4xl font-bold text-primary">{initials}</span>
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground">{profile.firstName} {profile.lastName}</h2>
            <p className="text-muted-foreground mb-4">{profile.major}</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <GraduationCap className="w-4 h-4" />
                <span>{profile.university}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{profile.year}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border/50">
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="glass-card border-border/50 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">First Name</label>
                <Input 
                  value={profile.firstName} 
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  disabled={!isEditing}
                  className="bg-secondary/50 border-border/50 rounded-xl disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Last Name</label>
                <Input 
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  disabled={!isEditing}
                  className="bg-secondary/50 border-border/50 rounded-xl disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                    className="pl-10 bg-secondary/50 border-border/50 rounded-xl disabled:opacity-70"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                    className="pl-10 bg-secondary/50 border-border/50 rounded-xl disabled:opacity-70"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">University</label>
                <Input 
                  value={profile.university}
                  onChange={(e) => setProfile({...profile, university: e.target.value})}
                  disabled={!isEditing}
                  className="bg-secondary/50 border-border/50 rounded-xl disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Major</label>
                <Input 
                  value={profile.major}
                  onChange={(e) => setProfile({...profile, major: e.target.value})}
                  disabled={!isEditing}
                  className="bg-secondary/50 border-border/50 rounded-xl disabled:opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none disabled:opacity-70"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Skills</label>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
                {isEditing && (
                  <button className="px-3 py-1 border border-dashed border-border/50 text-muted-foreground rounded-lg text-sm hover:border-primary/50 hover:text-primary transition-colors">
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground btn-glow">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
