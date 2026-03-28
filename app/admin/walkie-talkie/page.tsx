"use client"

import { useState, useEffect } from "react"
import { Radio, Mic, MicOff, Volume2, VolumeX, Users, Signal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { subscribe, create, COLLECTIONS, formatTimestamp } from "@/lib/firestore"
import { orderBy, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"

export default function WalkieTalkiePage() {
  const { userData } = useAuth()
  const [channels, setChannels] = useState<any[]>([])
  const [recentTransmissions, setRecentTransmissions] = useState<any[]>([])
  const [isPTTActive, setIsPTTActive] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<any>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [showChannelDropdown, setShowChannelDropdown] = useState(false)

  useEffect(() => {
    const unsubs = [
      subscribe(COLLECTIONS.WALKIE_CHANNELS, setChannels),
      subscribe(COLLECTIONS.WALKIE_TRANSMISSIONS, setRecentTransmissions, orderBy("createdAt", "desc")),
    ]
    return () => unsubs.forEach(u => u())
  }, [])

  useEffect(() => {
    if (!selectedChannel && channels.length > 0) {
      setSelectedChannel(channels[0])
    }
  }, [channels, selectedChannel])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Walkie Talkie</h1>
        <p className="text-muted-foreground mt-1">Real-time voice communication with volunteers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main PTT Interface */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col items-center">
                {/* Channel Selector */}
                <div className="relative w-full max-w-xs mb-8">
                  <button
                    onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                    className="w-full flex items-center justify-between p-4 bg-secondary/50 border border-border/50 rounded-xl hover:bg-secondary/70 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                      <span className="font-medium text-foreground">{selectedChannel?.name || "Select Channel"}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showChannelDropdown ? "rotate-180" : ""}`} />
                  </button>
                  
                  {showChannelDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => {
                            setSelectedChannel(channel)
                            setShowChannelDropdown(false)
                          }}
                          className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-all duration-200 ${
                            selectedChannel.id === channel.id ? "bg-primary/10" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${channel.active ? "bg-primary" : "bg-muted-foreground"}`} />
                            <span className="text-foreground">{channel.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{channel.members} members</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PTT Button */}
                <div className="relative mb-8">
                  <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isPTTActive 
                      ? "bg-primary glow-emerald scale-105" 
                      : "bg-secondary/50 border-4 border-border/50 hover:border-primary/30"
                  }`}
                    onMouseDown={() => setIsPTTActive(true)}
                    onMouseUp={() => setIsPTTActive(false)}
                    onMouseLeave={() => setIsPTTActive(false)}
                    onTouchStart={() => setIsPTTActive(true)}
                    onTouchEnd={() => setIsPTTActive(false)}
                  >
                    {isPTTActive ? (
                      <Mic className="w-20 h-20 text-primary-foreground" />
                    ) : (
                      <MicOff className="w-20 h-20 text-muted-foreground" />
                    )}
                  </div>
                  {isPTTActive && (
                    <>
                      <div className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                      <div className="absolute -inset-4 rounded-full animate-pulse bg-primary/10" />
                    </>
                  )}
                </div>

                {/* Status */}
                <p className={`text-lg font-medium mb-6 ${isPTTActive ? "text-primary" : "text-muted-foreground"}`}>
                  {isPTTActive ? "Broadcasting to " + (selectedChannel?.name || "channel") + "..." : "Hold to Talk"}
                </p>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <Button
                    variant={isMuted ? "default" : "outline"}
                    size="lg"
                    onClick={() => setIsMuted(!isMuted)}
                    className={isMuted ? "bg-destructive hover:bg-destructive/90" : "border-border/50"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
                    {isMuted ? "Muted" : "Sound On"}
                  </Button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl">
                    <Signal className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Strong Signal</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Channels */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Radio className="w-4 h-4 text-primary" />
                </div>
                Active Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      selectedChannel.id === channel.id 
                        ? "bg-primary/10 border border-primary/30" 
                        : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${channel.active ? "bg-primary" : "bg-muted-foreground"}`} />
                      <span className="text-sm text-foreground">{channel.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {channel.members}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transmissions */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-chart-2" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransmissions.map((transmission) => (
                  <div
                    key={transmission.id}
                    className="p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{transmission.sender}</span>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(transmission.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{transmission.channel || ""}</p>
                    <p className="text-sm text-foreground/80">{transmission.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
