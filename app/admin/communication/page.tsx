"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, Search, Users, Hash, Plus, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { subscribe, create, COLLECTIONS, formatTimestamp } from "@/lib/firestore"
import { orderBy, serverTimestamp, where } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"

export default function CommunicationPage() {
  const { user, userData } = useAuth()
  const [channels, setChannels] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [selectedChannel, setSelectedChannel] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const unsub = subscribe(COLLECTIONS.CHANNELS, setChannels)
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!selectedChannel && channels.length > 0) {
      setSelectedChannel(channels[0])
    }
  }, [channels, selectedChannel])

  useEffect(() => {
    if (!selectedChannel?.id) return
    const unsub = subscribe(
      `${COLLECTIONS.CHANNELS}/${selectedChannel.id}/messages`,
      setMessages,
      orderBy("createdAt", "asc"),
    )
    return () => unsub()
  }, [selectedChannel?.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChannel?.id) return
    await create(`${COLLECTIONS.CHANNELS}/${selectedChannel.id}/messages`, {
      sender: userData?.name || user?.displayName || "Admin",
      avatar: (userData?.name || "A").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
      message: newMessage,
      isOwn: true,
      uid: user?.uid,
      createdAt: serverTimestamp(),
    })
    setNewMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Communication Hub</h1>
        <p className="text-muted-foreground mt-1">Real-time messaging with teams and volunteers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Sidebar */}
        <Card className="glass-card border-border/50 lg:col-span-1 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 rounded-xl"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Channels */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Channels</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                        selectedChannel.id === channel.id
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        <span className="text-sm">{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {channel.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Messages */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Direct Messages</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {directMessages.map((dm) => (
                    <button
                      key={dm.id}
                      className="w-full flex items-center gap-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{dm.avatar}</span>
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                          dm.status === "online" ? "bg-primary" :
                          dm.status === "away" ? "bg-chart-3" : "bg-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">{dm.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{dm.lastMessage}</p>
                      </div>
                      {dm.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {dm.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="glass-card border-border/50 lg:col-span-3 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Channel Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedChannel?.name || "Select a channel"}</h3>
                  <p className="text-xs text-muted-foreground">{selectedChannel?.members || 0} members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Users className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.uid === user?.uid
                return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-primary">{message.avatar || "?"}</span>
                  </div>
                  <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <span className="text-sm font-medium text-foreground">{message.sender}</span>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(message.createdAt)}</span>
                    </div>
                    <div className={`inline-block p-3 rounded-2xl ${
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "bg-secondary/50 text-foreground rounded-tl-md"
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border/50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-foreground shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder={`Message #${selectedChannel?.name || "channel"}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-secondary/50 border-border/50 rounded-xl"
                />
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-foreground shrink-0">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
