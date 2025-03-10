# Rushikesh Nimkar's Portfolio

A modern portfolio website built with Next.js 15, featuring AI chat integration and interactive animations.

## ✨ Features

- **AI-Powered Email Generation**: Create professional emails with AI assistance
- **Interactive Chat**: Talk directly with an AI version of me using advanced LLMs
- **Vector Embeddings**: Semantic search capabilities for more accurate AI responses
- **Dynamic Animations**: Engaging UI with smooth animations
- **Responsive Design**: Seamless experience across all devices
- **Dark Mode**: Eye-friendly interface for all lighting conditions
- **Project Showcase**: Interactive displays of my work and contributions


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **AI Integration**: OpenRouter API (Llama 3.3)
- **Backend**: Next.js API Routes, Node.js
- **Vector Database**: Pinecone for semantic search and embeddings
- **Embeddings**: Google Gemini for generating vector embeddings
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

> **⚠️ IMPORTANT NOTE:** Make sure to uncomment the following line in `api/chat/route.ts` when working in development:
> ```javascript
> // "http://localhost:3000",
> ```

---
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
- Uses vector embeddings for more accurate and relevant responses

## 🔍 Vector Database Integration

The portfolio uses Pinecone vector database to store and retrieve embeddings:
- Semantic search capabilities for more accurate AI responses
- Google Gemini embeddings for high-quality vector representations
- Efficient retrieval of relevant information based on user queries
- One-time initialization with profile data for persistent storage

### Vector Store Scripts

The project includes scripts for managing the vector database:

1. **Initialize Vector Store**:
   ```bash
   npx ts-node scripts/init-vector-store.ts
   ```
   This script processes the content in `lib/character.ts` and creates vector embeddings in Pinecone.

2. **Update Vector Store** (when you update your profile information):
   ```bash
   npx ts-node scripts/init-vector-store.ts --force
   ```
   Use the `--force` flag to recreate the index even if it already exists.


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
EMAIL_APP_PASSWORD="your App Password" # get it from your Google Account settings
ABSTRACT_API_KEY="your abstract api key" # https://app.abstractapi.com/
OPENROUTER_API_KEY="your openrouter api key" # https://openrouter.ai/
TAVILY_API_KEY="your Tavily api key" # https://tavily.com/

# Vector Database (Pinecone)
PINECONE_API_KEY="your Pinecone API key" # https://app.pinecone.io/
PINECONE_ENVIRONMENT="your Pinecone environment" # e.g., gcp-starter
PINECONE_INDEX_NAME="your index name" # e.g., portfolio-embeddings

# Google Gemini (for embeddings)
GOOGLE_API_KEY="your Google API key" # https://ai.google.dev/
```

## Vector Store Configuration

The vector store is configured in `lib/embeddings.ts` with the following settings:
- Dimension: 768 (Google Gemini embeddings)
- Metric: Cosine similarity
- Pod type: Starter (free tier)

You can modify these settings in the `initializeVectorStore` function if needed.
