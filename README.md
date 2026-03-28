# ⚡ HackHub — Hackathon Management Platform

> The all-in-one platform for organizing, managing, and running successful hackathons — built at **Techstasy 2.0**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![NextAuth](https://img.shields.io/badge/NextAuth.js-JWT-green?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)

---

## 🚀 Features

- 🔐 **Role-Based Authentication** — Separate access for Admins and Participants via NextAuth.js
- 👥 **Team Management** — Seamless team formation and participant tracking
- 📡 **Real-time Coordination** — Instant communication across all teams and volunteers
- 🛡️ **Secure Access** — JWT sessions with role-based permissions
- 🎨 **Modern UI** — Beautiful dark-themed interface built with shadcn/ui + Tailwind CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Auth | NextAuth.js (JWT) |
| Styling | Tailwind CSS + shadcn/ui |
| Package Manager | npm |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/ayxsh678/v0-hack-hub.git
cd v0-hack-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your NEXTAUTH_SECRET and NEXTAUTH_URL
```

### Running the Dev Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication

HackHub supports two roles:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Admin / Manager | `admin@test.com` | `1234` | `/admin` |
| Volunteer / Participant | `user@test.com` | `1234` | `/student` |

> Role mismatch is handled — admins cannot log in via the Participant tab and vice versa.

---

## 📁 Project Structure
```
v0-hack-hub/
├── app/
│   ├── page.tsx              # Login page
│   ├── admin/                # Admin dashboard
│   ├── student/              # Participant dashboard
│   ├── dashboard/            # General dashboard
│   └── api/auth/[...nextauth]/ # NextAuth API route
├── components/               # Reusable UI components (shadcn/ui)
├── types/                    # TypeScript type declarations
├── lib/                      # Utility functions
└── styles/                   # Global styles
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ at <strong>Techstasy 2.0</strong></p>
