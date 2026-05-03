IntelliTask | AI-Powered Project Management Ecosystem

Hey there! Welcome to IntelliTask.
I built this project during my final year because I realized that most project management tools are either too bloated or too simple. I wanted to build something "Linear-level" sleek, but with a backbone of strict Role-Based Access Control (RBAC) and actual AI-driven analytics.
This is a full-stack MERN application that handles the entire project lifecycle—from high-level system governance by an Admin to task execution by a Team Member.

Demo & Experience

Note: The UI is designed with a Deep Dark Theme (Glassmorphism). I used Framer Motion for all page transitions to ensure that "Premium SaaS" feel.
Frontend: Hosted on Firebase
Backend: Hosted on Render
Database: MongoDB Atlas

Key Features (What makes it special?)

🔐 1. The "Triple-Lock" Auth System
I didn't just go with a basic login. IntelliTask features:
Role Selection Gate: You choose your path before you authenticate.
Role-Lock Logic: If you're registered as a Manager, you can't "hijack" an Admin session. The backend checks your MongoDB record against your requested role and will block you with a 403 Forbidden if they don't match.
Secure Admin Portal: A hidden gateway for the system owner. Google Login is disabled for Admin to prevent unauthorized entry; only a pre-seeded Master ID/Password works.
🤖 2. Llama AI Integration
Instead of just showing static charts, I built a simulation of Llama AI Intelligence.
It analyzes your team's velocity.
It detects bottlenecks (e.g., if too many tasks are stuck in "In Progress").
It provides custom "Member Recommendations" to build work momentum.
📊 3. Role-Based Command Centers
Each role gets a completely different sidebar and set of tools:
Admin: "Authority Console"—purely for managing people. Adding/Deleting Managers and Members.
Manager: "Control Room"—Project creation, allocation to members, setting deadlines, and a performance leaderboard.
Member: "My Lab"—A focused workspace. They only see what's assigned to them. Includes a Deep Work/Focus Mode.
