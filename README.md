# 💥 HackMate — Find Your Perfect Hackathon Partner

HackMate is a fun yet functional platform that connects hackers, developers, designers, and creators for hackathons.  
Think **Tinder for Hackathons** — swipe, match, and team up for your next big project!

---

## 🚀 Tech Stack

**Frontend (client):**
- React + Vite  
- Tailwind CSS  
- TypeScript  

**Backend (server):**
- Node.js + Express  
- MongoDB (Mongoose)  
- Supabase (for auth/logging if used)


## 📁 Folder Structure

```bash
hackmate/
├── client/                 # Frontend (React + Vite)
│   ├── src/                # Components, pages, logic
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind setup
│   └── vite.config.ts      # Vite configuration
│
├── server/                 # Backend (Express + MongoDB)
│   ├── src/                # Routes, controllers, models
│   ├── supabase/           # Auth / migration files
│   └── package.json        # Backend dependencies
│
├── README.md
└── .gitignore



## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hackmate.git
cd hackmate

2. Install Dependencies
Install both client and server dependencies:
cd client
npm install
cd ../server
npm install

3. Set Up Environment Variables
In the server folder, create a .env file and add:


MONGODB_URI=your_mongodb_connection_string
PORT=5000

If you’re using Supabase:
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
4. Run the App
Start backend and frontend servers separately:

Backend:
cd server
npm run dev

Frontend:
cd client
npm run dev
Now open your browser at:

http://localhost:5173
🧠 Core Features
🔍 Create your HackMate profile with verified email & phone

💾 Upload your past projects and skill tags

💬 Swipe & Match with potential teammates for specific hackathons

🎯 Explore hackathon communities and connect with like-minded builders

🏅 Earn badges & credibility points for participation and teamwork

🧩 Future Scope
AI-based teammate recommendations

In-app chat & video calls

Skill-based matchmaking

Verified hackathon integrations (Devfolio, MLH, etc.)

🛠️ Scripts
Command	Description
npm run dev	Starts the development server
npm run build	Builds the project for production
npm start	Runs the server in production mode
npm run lint	Lints your code

🤝 Contributing
Pull requests are welcome!
If you have ideas to make HackMate even cooler, feel free to fork, tweak, and open a PR.

🧡 Acknowledgements
Built with caffeine ☕, curiosity 🤓, and a lot of late-night debugging.
Made for hackers who believe in “Build. Break. Repeat.”


