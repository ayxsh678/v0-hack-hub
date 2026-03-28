"use client"

import { db } from "@/lib/firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { COLLECTIONS, create } from "@/lib/firestore"

/**
 * Seeds Firestore with initial data for all collections.
 * Call this once from the admin settings or via a button.
 */
export async function seedFirestore() {
  // ── Announcements ──
  const announcements = [
    { title: "WiFi Password Update", message: "The WiFi password has been changed to 'HackHub2024'. Please update your devices.", priority: "urgent", target: "all", views: 0 },
    { title: "Dinner Service at 7 PM", message: "Dinner will be served in Hall B starting at 7 PM. Vegetarian options available at Station 3.", priority: "info", target: "all", views: 0 },
    { title: "Project Submission Deadline", message: "Reminder: All project ideas must be submitted by 4 PM today through the HackHub portal.", priority: "urgent", target: "participants", views: 0 },
    { title: "Server Room 3 Available", message: "Server Room 3 is now open for teams requiring additional computing resources.", priority: "info", target: "teams", views: 0 },
    { title: "Mentor Sessions Starting", message: "Mentor office hours begin at 3 PM. Check your assigned mentor and room on the dashboard.", priority: "info", target: "participants", views: 0 },
  ]
  for (const a of announcements) {
    await create(COLLECTIONS.ANNOUNCEMENTS, a)
  }

  // ── Schedule ──
  const schedule = [
    { title: "Opening Ceremony", time: "09:00 AM", endTime: "10:00 AM", location: "Main Hall A", description: "Welcome address and event kickoff", attendees: 486, status: "completed", day: "Day 1", order: 1 },
    { title: "Team Formation & Registration", time: "10:00 AM", endTime: "11:00 AM", location: "Registration Desk", description: "Teams finalize their registration and receive materials", attendees: 486, status: "completed", day: "Day 1", order: 2 },
    { title: "Hacking Begins", time: "11:00 AM", endTime: "12:00 PM", location: "All Venues", description: "Official start of the hackathon coding period", attendees: 486, status: "active", day: "Day 1", order: 3 },
    { title: "Lunch Break", time: "12:30 PM", endTime: "01:30 PM", location: "Cafeteria", description: "Lunch service for all participants", attendees: 500, status: "upcoming", day: "Day 1", order: 4 },
    { title: "Mentor Office Hours", time: "02:00 PM", endTime: "04:00 PM", location: "Meeting Rooms", description: "First round of mentor consultations", attendees: 200, status: "upcoming", day: "Day 1", order: 5 },
    { title: "Workshop: API Integration", time: "03:00 PM", endTime: "04:00 PM", location: "Room 201", description: "Technical workshop on integrating sponsor APIs", attendees: 80, status: "upcoming", day: "Day 1", order: 6 },
    { title: "Progress Check-in", time: "05:00 PM", endTime: "06:00 PM", location: "All Teams", description: "Volunteers check team progress", attendees: 124, status: "upcoming", day: "Day 1", order: 7 },
    { title: "Dinner Service", time: "07:00 PM", endTime: "08:00 PM", location: "Hall B", description: "Dinner for all participants and staff", attendees: 520, status: "upcoming", day: "Day 1", order: 8 },
  ]
  for (const s of schedule) {
    await create(COLLECTIONS.SCHEDULE, s)
  }

  // ── Rooms ──
  const rooms = [
    { name: "Hall A", capacity: 50, occupied: 45, type: "Main Hall", status: "active", team: "Code Wizards" },
    { name: "Hall B", capacity: 50, occupied: 42, type: "Main Hall", status: "active", team: "Binary Beasts" },
    { name: "Room 101", capacity: 10, occupied: 8, type: "Meeting Room", status: "active", team: "Pixel Pioneers" },
    { name: "Room 102", capacity: 10, occupied: 10, type: "Meeting Room", status: "full", team: "Data Dragons" },
    { name: "Room 103", capacity: 10, occupied: 0, type: "Meeting Room", status: "available", team: null },
    { name: "Lab 1", capacity: 20, occupied: 18, type: "Computer Lab", status: "active", team: "API Avengers" },
    { name: "Lab 2", capacity: 20, occupied: 15, type: "Computer Lab", status: "active", team: "Cloud Chasers" },
    { name: "Server Room", capacity: 5, occupied: 3, type: "Technical", status: "restricted", team: null },
    { name: "Cafeteria", capacity: 100, occupied: 25, type: "Common Area", status: "active", team: null },
    { name: "Lounge", capacity: 30, occupied: 12, type: "Rest Area", status: "active", team: null },
    { name: "Room 201", capacity: 8, occupied: 0, type: "Meeting Room", status: "available", team: null },
    { name: "Room 202", capacity: 8, occupied: 6, type: "Meeting Room", status: "active", team: "Neural Ninjas" },
  ]
  for (const r of rooms) {
    await create(COLLECTIONS.ROOMS, r)
  }

  // ── Issues ──
  const issues = [
    { title: "Power outlet not working in Room 103", description: "Multiple participants reported that the power outlets near the window are not functioning.", reporter: "Sarah Chen", priority: "high", status: "open", category: "Infrastructure", assignee: "Tech Team" },
    { title: "WiFi connectivity issues in Hall B", description: "Intermittent WiFi disconnections affecting teams in the back section.", reporter: "Mike Johnson", priority: "critical", status: "in-progress", category: "Network", assignee: "Network Admin" },
    { title: "Projector not displaying in Room 201", description: "The projector shows no signal when connecting laptops via HDMI.", reporter: "Emily Davis", priority: "medium", status: "open", category: "Equipment", assignee: "Unassigned" },
    { title: "Air conditioning too cold in Lab 1", description: "Participants are complaining about the temperature being too low.", reporter: "Alex Kim", priority: "low", status: "resolved", category: "Facilities", assignee: "Facilities" },
  ]
  for (const i of issues) {
    await create(COLLECTIONS.ISSUES, i)
  }

  // ── Budget Categories ──
  const budgetCategories = [
    { name: "Venue & Facilities", allocated: 5000, spent: 4200, color: "bg-primary" },
    { name: "Food & Beverages", allocated: 3000, spent: 1800, color: "bg-chart-2" },
    { name: "Prizes & Awards", allocated: 4000, spent: 0, color: "bg-chart-3" },
    { name: "Tech & Equipment", allocated: 2500, spent: 2100, color: "bg-chart-4" },
    { name: "Marketing", allocated: 1500, spent: 1200, color: "bg-chart-5" },
    { name: "Miscellaneous", allocated: 2000, spent: 850, color: "bg-muted-foreground" },
  ]
  for (const b of budgetCategories) {
    await create(COLLECTIONS.BUDGET_CATEGORIES, b)
  }

  // ── Transactions ──
  const transactions = [
    { description: "Catering deposit - Day 1", amount: -800, category: "Food & Beverages" },
    { description: "Additional power strips", amount: -120, category: "Tech & Equipment" },
    { description: "Sponsor contribution - TechCorp", amount: 2500, category: "Income" },
    { description: "Venue cleaning service", amount: -350, category: "Venue & Facilities" },
    { description: "Printing banners and signs", amount: -280, category: "Marketing" },
    { description: "Coffee and snacks restock", amount: -450, category: "Food & Beverages" },
  ]
  for (const t of transactions) {
    await create(COLLECTIONS.TRANSACTIONS, t)
  }

  // ── Volunteers ──
  const volunteers = [
    { name: "Sarah Chen", role: "Floor Manager", area: "Building A - Floor 1", status: "active", shift: "08:00 AM - 04:00 PM", tasksCompleted: 12, currentRound: 2, phone: "+1 (555) 123-4567", email: "sarah.c@hackhub.com" },
    { name: "Mike Johnson", role: "Tech Support Lead", area: "Server Room & Labs", status: "active", shift: "10:00 AM - 06:00 PM", tasksCompleted: 18, currentRound: 2, phone: "+1 (555) 234-5678", email: "mike.j@hackhub.com" },
    { name: "Emily Davis", role: "Food Coordinator", area: "Cafeteria & Hall B", status: "break", shift: "06:00 AM - 02:00 PM", tasksCompleted: 8, currentRound: 1, phone: "+1 (555) 345-6789", email: "emily.d@hackhub.com" },
    { name: "Alex Kim", role: "Registration Lead", area: "Main Entrance", status: "active", shift: "07:00 AM - 03:00 PM", tasksCompleted: 45, currentRound: 2, phone: "+1 (555) 456-7890", email: "alex.k@hackhub.com" },
    { name: "David Park", role: "Floor Manager", area: "Building A - Floor 2", status: "active", shift: "08:00 AM - 04:00 PM", tasksCompleted: 15, currentRound: 2, phone: "+1 (555) 567-8901", email: "david.p@hackhub.com" },
    { name: "Lisa Wong", role: "Tech Support", area: "Main Hall A", status: "offline", shift: "02:00 PM - 10:00 PM", tasksCompleted: 0, currentRound: 0, phone: "+1 (555) 678-9012", email: "lisa.w@hackhub.com" },
  ]
  for (const v of volunteers) {
    await create(COLLECTIONS.VOLUNTEERS, v)
  }

  // ── Teams ──
  const teams = [
    { name: "Code Wizards", score: 950, members: 4, category: "AI/ML", projectName: "SmartAssist", inviteCode: "HACKWIZ1", change: 0 },
    { name: "Binary Beasts", score: 890, members: 3, category: "Web3", projectName: "ChainVote", inviteCode: "HACKBIN2", change: 1 },
    { name: "Pixel Pioneers", score: 845, members: 4, category: "HealthTech", projectName: "MediTrack", inviteCode: "HACKPIX3", change: -1 },
    { name: "Data Dragons", score: 780, members: 5, category: "FinTech", projectName: "BudgetBot", inviteCode: "HACKDAT4", change: 2 },
    { name: "API Avengers", score: 720, members: 4, category: "DevTools", projectName: "APIForge", inviteCode: "HACKAPI5", change: 0 },
    { name: "Cloud Chasers", score: 695, members: 3, category: "Cloud", projectName: "CloudSync", inviteCode: "HACKCLO6", change: -2 },
    { name: "Neural Ninjas", score: 670, members: 4, category: "AI/ML", projectName: "NeuralArt", inviteCode: "HACKNEU7", change: 1 },
    { name: "Stack Overflow", score: 645, members: 5, category: "Education", projectName: "LearnHub", inviteCode: "HACKSTK8", change: 3 },
    { name: "Debug Dynasty", score: 620, members: 4, category: "DevTools", projectName: "BugHunter", inviteCode: "HACKDBG9", change: -1 },
    { name: "Frontend Force", score: 590, members: 3, category: "Web", projectName: "UIKit Pro", inviteCode: "HACKFNT0", change: 0 },
  ]
  for (const t of teams) {
    await create(COLLECTIONS.TEAMS, t)
  }

  // ── Channels ──
  const channels = [
    { name: "general", type: "channel", members: 486 },
    { name: "announcements", type: "channel", members: 486 },
    { name: "tech-support", type: "channel", members: 124 },
    { name: "volunteers", type: "channel", members: 24 },
    { name: "mentors", type: "channel", members: 15 },
    { name: "organizers", type: "channel", members: 8 },
  ]
  for (const c of channels) {
    await create(COLLECTIONS.CHANNELS, c)
  }

  // ── Walkie Channels ──
  const walkieChannels = [
    { name: "All Volunteers", members: 24, active: true },
    { name: "Floor Managers", members: 6, active: true },
    { name: "Tech Support", members: 8, active: true },
    { name: "Food & Logistics", members: 5, active: false },
    { name: "Registration", members: 4, active: true },
    { name: "Security", members: 3, active: false },
  ]
  for (const w of walkieChannels) {
    await create(COLLECTIONS.WALKIE_CHANNELS, w)
  }

  // ── Event Settings ──
  await setDoc(doc(db, COLLECTIONS.EVENT_SETTINGS, "main"), {
    eventName: "HackHub 2026",
    venue: "Tech Innovation Center",
    startDate: "2026-03-27",
    endDate: "2026-03-29",
    currentRound: 2,
    totalRounds: 4,
    createdAt: serverTimestamp(),
  })

  return true
}
