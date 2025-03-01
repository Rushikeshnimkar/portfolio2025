# Rushikesh Nimkar's Portfolio

A modern portfolio website built with Next.js 15, featuring AI chat integration and interactive animations.

## ✨ Features

- **AI-Powered Email Generation**: Create professional emails with AI assistance
- **Interactive Chat**: Talk directly with an AI version of me using advanced LLMs
- **Dynamic Animations**: Engaging UI with smooth animations
- **Responsive Design**: Seamless experience across all devices
- **Dark Mode**: Eye-friendly interface for all lighting conditions
- **Project Showcase**: Interactive displays of my work and contributions


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **AI Integration**: OpenRouter API (Llama 3.3)
- **Backend**: Next.js API Routes, Node.js
- **Search Capability**: Tavily API for real-time information
- **Email Services**: Nodemailer, Abstract API for email validation
- **Deployment**: Vercel with Edge Functions


## 🚀 Getting Started

1. Clone and install:
```bash
git clone https://github.com/Rushikeshnimkar/portfolio2025.git
cd portfolio
npm install
```

2. Run development server:
```bash
npm run dev
```
3. Open [http://localhost:3000](http://localhost:3000)

## 📧 Email Generation Feature

The portfolio includes an AI-powered email generation system that:
- Creates professional emails based on simple prompts
- Validates sender email addresses
- Supports both AI-generated and manual email composition
- Features elegant text generation animations

## 💬 AI Chat Integration

Chat with an AI version of me that:
- Answers questions about my skills, experience, and projects
- Accesses real-time information when needed via Tavily search
- Maintains conversation context across messages
- Provides accurate information about my background and expertise

## 🔒 Security Features

- CORS protection for API routes
- Email validation to prevent spam
- Rate limiting on sensitive endpoints
- Environment variable protection


## Environment Variables

Create a `.env` file in the root directory and add your environment variables:

```env
# Development environment (all the apis are free)
EMAIL_USER="your emailid"
EMAIL_APP_PASSWORD="your App Password" //get it from your Google Account settings
ABSTRACT_API_KEY="your abstract api key" //https://app.abstractapi.com/
OPENROUTER_API_KEY="your openrouter api key" //https://openrouter.ai/
TAVILY_API_KEY="your Tavily api key" //https://tavily.com/
