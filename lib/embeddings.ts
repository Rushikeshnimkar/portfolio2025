import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";

// Initialize Google Gemini embeddings
const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY!,
    modelName: "text-embedding-004", // Gemini's embedding model
  });
};

// Function to initialize the vector store (run this once)
export async function initializeVectorStore() {
  try {
    // Initialize Pinecone client with correct configuration
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Import character content
    const { characterContent } = await import(
      "../components/character/character"
    );

    // Split the character content into chunks
    const chunks = splitTextIntoChunks(characterContent, 500);
    console.log(`Created ${chunks.length} chunks from character content`);

    // Create documents from chunks
    const documents = chunks.map(
      (chunk, i) =>
        new Document({
          pageContent: chunk,
          metadata: { source: "character", chunk: i },
        })
    );

    // Get or create the index
    // Use environment variable for index name with fallback
    const indexName = process.env.PINECONE_INDEX_NAME || "rushikesh-portfolio";
    console.log(`Using index name: ${indexName}`);

    // List existing indexes
    const indexes = await pinecone.listIndexes();
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
            region: "us-east-1",
          },
        },
      });

      // Wait for index initialization
      console.log("Waiting for index to initialize...");
      await new Promise((resolve) => setTimeout(resolve, 60000));
      console.log("Index initialization wait complete");
    } else {
      console.log(`Index ${indexName} already exists`);
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
    return vectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    throw error;
  }
}

// Function to query the vector store
export async function queryVectorStore(query: string, k: number = 5) {
  try {
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Use environment variable for index name with fallback
    const indexName = process.env.PINECONE_INDEX_NAME || "rushikesh-portfolio";
    const index = pinecone.Index(indexName);
    const embeddings = getEmbeddings();

    // Create vector store from existing index
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: "character-info",
    });

    // Perform similarity search
    console.log(`Searching for: "${query}" with k=${k}`);
    const results = await vectorStore.similaritySearch(query, k);
    console.log(`Found ${results.length} results`);

    return results;
  } catch (error) {
    console.error("Error querying vector store:", error);
    throw error;
  }
}

// Helper function to split text into chunks
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];

  // Split by sentences first
  const sentences = text.split(/(?<=[.!?])\s+/);

  let currentChunk = "";

  for (const sentence of sentences) {
    // If adding this sentence doesn't exceed chunk size
    if ((currentChunk + sentence).length <= chunkSize) {
      currentChunk += (currentChunk ? " " : "") + sentence;
    } else {
      // If current chunk is not empty, add it to chunks
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      // Start a new chunk with current sentence
      currentChunk = sentence;
    }
  }

  // Add the last chunk if not empty
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Export a function to check if the vector store exists
export async function vectorStoreExists(): Promise<boolean> {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Use environment variable for index name with fallback
    const indexName = process.env.PINECONE_INDEX_NAME || "rushikesh-portfolio";

    const indexes = await pinecone.listIndexes();
    return indexes.indexes?.some((index) => index.name === indexName) || false;
  } catch (error) {
    console.error("Error checking if vector store exists:", error);
    return false;
  }
}
