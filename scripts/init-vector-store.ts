import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

// Log environment variables (for debugging, remove in production)
console.log("PINECONE_API_KEY exists:", !!process.env.PINECONE_API_KEY);
console.log("GOOGLE_API_KEY exists:", !!process.env.GOOGLE_API_KEY);

// Character content directly in the script
const characterContent = `
Rushikesh Nimkar
Full-Stack Engineer

Location: Nagpur
Phone: +919322675715
Email: rushikeshnimkar396@gmail.com
Portfolio: https://rushikeshnimkar.xyz/
GitHub: https://github.com/Rushikeshnimkar
LinkedIn: https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/
resume: https://rushikeshnimkar.xyz/resume


Summary:
I am a full-stack developer with expertise in Java, React.js, Next.js, and MySQL. Passionate about building scalable web applications with clean, maintainable code. Strong foundation in front-end development, creating responsive user interfaces, back-end integration, developing robust APIs, and database optimization for high-performance applications. Focused on delivering high-quality solutions while following best practices in software development and deployment.

Experience:
Lazarus Network Inc. | Full-Stack Engineer (Remote) | Feb 2024 - Feb 2025

Developed frontend with Next.js and React.js, and backend with Node.js.

Managed AWS EC2 and Google Cloud servers.

Deployed applications using Docker/Compose.

Added multichain support into Erebrus for enhanced security and scalability.

Developed Netsepio frontend with authentication for Aptos wallets.

Education:

AISSMS COE, Pune | BE Computer Engineering | 2020 - 2024

DR. M.K. UMATHE COLLEGE, Nagpur | 12th | 2019 - 2020

SCHOOL OF SCHOLARS, Nagpur | 10th | 2017 - 2018

Projects:

Gitsplit (https://ethglobal.com/showcase/gitsplit-pkp5d)

Developed a funding platform for open-source projects using Next.js, Golang, and PostgreSQL.

Connected GitHub API for seamless project discovery and user data management.

Implemented security features to ensure data protection and platform integrity.

Cryptorage (https://dorahacks.io/buidl/16435)

Developed a Chrome extension using React.js and Supabase for secure data storage.

Integrated Walrus blockchain and OCR for decentralized image storage and text extraction.

Designed a robust data management system with SQL and blockchain features, implementing an AI web summarizer API using Gemini Nano.

Terminal AI Assistant (https://www.npmjs.com/package/terminal-ai-assistant)

Node.js-based CLI tool that converts natural language into Windows command line instructions using DeepSeek-V3 AI.

Supports real-time execution, secure command handling, fast responses, and API key encryption while ensuring cross-platform support.

Skills:

Programming Languages: JavaScript, Java

Frameworks & Libraries: Next.js, React.js, TypeScript

Databases: MySQL, PostgreSQL

Tools: Git, Docker, GitHub, Postman

Awards:

Solana Radar Hackathon 2024

Achieved 4th place out of 200+ global teams, demonstrating expertise in blockchain technology and innovative problem-solving.

Sui Overflow 2024

Awarded the Community Favorite Award for Mystic Tarot, an innovative Web3 tarot reading platform on the Sui Network, showcasing blockchain and user-centric design expertise.

Languages:
English, Marathi, Hindi

hobbies:
- photography
- travelling
- listening to music
- coding
`;

// Initialize Google Gemini embeddings
const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY!,
    modelName: "text-embedding-004", // Gemini's embedding model
  });
};

// Helper function to split text into chunks
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];

  // Split by sections first (double newlines)
  const sections = text.split(/\n\n+/);

  let currentChunk = "";

  for (const section of sections) {
    // If adding this section doesn't exceed chunk size
    if ((currentChunk + section).length <= chunkSize) {
      currentChunk += (currentChunk ? "\n\n" : "") + section;
    } else {
      // If current chunk is not empty, add it to chunks
      if (currentChunk) {
        chunks.push(currentChunk);
      }

      // If the section itself is too large, split it further
      if (section.length > chunkSize) {
        // Split by sentences
        const sentences = section.split(/(?<=[.!?])\s+/);
        let sectionChunk = "";

        for (const sentence of sentences) {
          if ((sectionChunk + sentence).length <= chunkSize) {
            sectionChunk += (sectionChunk ? " " : "") + sentence;
          } else {
            if (sectionChunk) {
              chunks.push(sectionChunk);
            }
            sectionChunk = sentence;
          }
        }

        if (sectionChunk) {
          chunks.push(sectionChunk);
        }
      } else {
        // Start a new chunk with current section
        currentChunk = section;
      }
    }
  }

  // Add the last chunk if not empty
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Main function to initialize the vector store
async function initializeVectorStore() {
  try {
    // Check if API keys are available
    if (!process.env.PINECONE_API_KEY) {
      throw new Error(
        "PINECONE_API_KEY is not defined in environment variables"
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not defined in environment variables");
    }

    console.log("API keys found, proceeding with initialization...");

    // Initialize Pinecone client with correct configuration
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    // Split the character content into chunks
    const chunks = splitTextIntoChunks(characterContent, 500);
    console.log(`Created ${chunks.length} chunks from character content:`);

    // Log the first few characters of each chunk for verification
    chunks.forEach((chunk, i) => {
      console.log(`Chunk ${i + 1}: ${chunk.substring(0, 50)}...`);
    });

    // Create documents from chunks
    const documents = chunks.map(
      (chunk, i) =>
        new Document({
          pageContent: chunk,
          metadata: {
            source: "character",
            chunk: i,
            section: identifySection(chunk),
          },
        })
    );

    // Get or create the index
    const indexName = "rushikesh-portfolio";

    // List existing indexes
    const indexes = await pinecone.listIndexes();
    console.log("Available indexes:", indexes);

    const indexExists =
      indexes.indexes?.some((index) => index.name === indexName) || false;

    if (!indexExists) {
      console.log(`Creating index ${indexName}`);
      await pinecone.createIndex({
        name: indexName,
        dimension: 768, // Gemini embeddings dimension
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-west-1",
          },
        },
      });

      // Wait for index initialization
      console.log("Waiting for index to initialize...");
      await new Promise((resolve) => setTimeout(resolve, 60000));
      console.log("Index initialization wait complete");
    } else {
      console.log(`Index ${indexName} already exists`);

      // Delete all existing vectors if index exists
      try {
        const index = pinecone.Index(indexName);
        console.log("Deleting existing vectors...");
        await index.deleteAll();
        console.log("Existing vectors deleted successfully");
      } catch (error) {
        console.error("Error deleting existing vectors:", error);
      }
    }

    // Get the index
    const index = pinecone.Index(indexName);

    // Create embeddings instance
    const embeddings = getEmbeddings();

    // Create and populate the vector store
    console.log("Creating vector store from documents...");
    const vectorStore = await PineconeStore.fromDocuments(
      documents,
      embeddings,
      {
        pineconeIndex: index,
        namespace: "character-info",
      }
    );

    console.log("Vector store initialized successfully");

    // Test a query to verify it works
    console.log("Testing a query...");
    const testQuery = "What are Rushikesh's skills?";
    const results = await vectorStore.similaritySearch(testQuery, 2);
    console.log("Test query results:");
    results.forEach((result, i) => {
      console.log(
        `Result ${i + 1}: ${result.pageContent.substring(0, 100)}...`
      );
    });

    return vectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    throw error;
  }
}

// Helper function to identify which section a chunk belongs to
function identifySection(chunk: string): string {
  const lowerChunk = chunk.toLowerCase();

  if (lowerChunk.includes("summary")) return "summary";
  if (lowerChunk.includes("experience")) return "experience";
  if (lowerChunk.includes("education")) return "education";
  if (lowerChunk.includes("projects")) return "projects";
  if (lowerChunk.includes("skills")) return "skills";
  if (lowerChunk.includes("awards")) return "awards";
  if (lowerChunk.includes("languages")) return "languages";
  if (lowerChunk.includes("hobbies")) return "hobbies";
  if (
    lowerChunk.includes("contact") ||
    lowerChunk.includes("email") ||
    lowerChunk.includes("phone")
  )
    return "contact";

  return "general";
}

// Run the initialization
async function main() {
  console.log("Starting vector store initialization...");
  try {
    await initializeVectorStore();
    console.log("Vector store initialization completed successfully!");
  } catch (error) {
    console.error("Failed to initialize vector store:", error);
  }
  process.exit(0);
}

main();
