# HirePrep - Placement & Interview Preparation Platform

**HirePrep** is a full-stack, comprehensive interview preparation platform designed for students, software engineers, and job seekers to master Technical MCQs, Coding & DSA problems, SQL Querying, and HR Interview scenarios.

---

## 🚀 Features

- **Technical MCQ Practice**: Hundreds of curated questions across C, C++, Java, Python, SQL, and HR topics with detailed explanations.
- **SQL Query Playground**: Execute real SQL queries against an interactive sample database (Employees, Departments) with immediate table rendering and solution comparisons.
- **Coding & DSA Sandbox**: Clean, language-specific problem templates (Python, C++, C, Java) without unnecessary boilerplate or pre-written code.
- **HR Interview Simulator**: Practice Behavioral & HR interview questions with structured answer guidelines and rating rubrics.
- **Collaborative Study Rooms**: Real-time study spaces and group workspaces for peer practice.
- **Analytics & Progress Dashboard**: Real-time performance metrics, topic mastery breakdowns, and score tracking.
- **Admin Control Panel**: Add, edit, or manage custom questions across categories.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, TypeScript (Bundled with `esbuild`)
- **Database / Store**: In-memory / JSON persistence with pre-loaded Question Banks
- **Build Tool**: Vite & `esbuild`

---

## 📋 Environment Variables

You can configure the following environment variable in `.env` or on your hosting provider (e.g. Render, Railway, Heroku):

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secure-custom-secret-key
```

---

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hinal-Tank/hireprep.git
   cd hireprep
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be running live at `http://localhost:3000`.

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Start Production Server:**
   ```bash
   npm run start
   ```
