import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

async function main() {
    console.log("Testing gemini-embedding-001 dimensions...");

    try {
        // Try passing outputDimensionality in the config (if supported)
        // Note: TypeScript might complain if it's not in the type definition, but we'll see if it works at runtime
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY!,
            modelName: "models/gemini-embedding-001",
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            // @ts-ignore - Trying to pass it even if not in types
            outputDimensionality: 768,
        });

        const text = "This is a test sentence to check embedding dimensions.";
        const vector = await embeddings.embedQuery(text);

        console.log(`Vector length: ${vector.length}`);

        if (vector.length === 768) {
            console.log("SUCCESS: Dimension is 768!");
        } else {
            console.log(`FAILURE: Dimension is ${vector.length} (expected 768)`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

main();
