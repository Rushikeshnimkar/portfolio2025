import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import * as dotenv from "dotenv";
import * as fs from "fs"; // Import fs if loading from file
import * as path from "path"; // Import path if loading from file

// Load environment variables from .env file in the current directory
dotenv.config();

// --- Configuration ---
const INDEX_NAME = "theme";
const DIMENSION = 768;
const GOOGLE_EMBEDDING_MODEL = "text-embedding-004"; // Use the latest Google embedding model

// --- Page Content ---
// Option 1: Paste the content directly (as shown below)
const pageContent = `
PAGE STRUCTURE: HOME PAGE
The home page is identified by the ID "home-page" and functions as the main landing page of the portfolio website.
The home page's main container is a <main> element with ID "home-page" that spans the full viewport.
Within the main container is a content wrapper with ID "home-content-wrapper" that organizes all home page content.
The content wrapper is divided into two primary sections: a profile section and a text content section.

The profile section has ID "home-profile-section" and contains visual elements like the profile image and Bitcoin symbol.
The profile image container has ID "home-profile-image-container" and is implemented as a motion.div with scale and fade animations.
The Bitcoin symbol has ID "home-bitcoin-symbol" and is implemented as a motion.div with hover animations.

The text content section has ID "home-text-content" and contains all text and interactive elements.
The main heading has ID "home-title" and is implemented as a motion.h1 with fade animations. It contains the name "Rushikesh Nimkar".
The subtitle has ID "home-subtitle" and is implemented as a motion.p element describing the professional role.
The detailed description has ID "home-description" and is implemented as a motion.p providing background information.
Action buttons are contained in a div with ID "home-action-buttons".
The main buttons container has ID "home-main-buttons" and includes the CV button and sponsor button.
Social media links are contained in a motion.div with ID "home-social-links".

The home page offers extensive customization options through specific theme targets:
- Background can be modified through the "#page-background-base" selector.
- Text elements can be targeted individually: "#home-title", "#home-subtitle", and "#home-description".
- Buttons have specific targets: "#home-cv-button-wrapper" and "#home-sponsor-button-wrapper".
- Profile elements can be styled using "#home-profile-image-container" and "#home-bitcoin-symbol".

The home page supports several types of modifications including: colors, spacing, animations, layout adjustments, text styling, button styling, and image effects.


PAGE STRUCTURE: PROJECTS PAGE

The projects page is identified by the ID "projects-page" and showcases the portfolio projects.
The main container has ID "projects-page" and holds all project-related content.
The content container has ID "projects-container" with controlled width and padding.
The page title has ID "projects-title" and features a gradient effect from neutral-200 to neutral-500 colors.
The title uses responsive typography sizing: text-4xl on mobile, text-5xl on tablets, and text-6xl on desktop.

Projects are displayed in a responsive grid with ID "projects-grid" that adapts to different screen sizes:
- Single column (grid-cols-1) on mobile devices
- Two columns (md:grid-cols-2) on tablet devices
- Three columns (lg:grid-cols-3) on desktop screens

Each project card follows a template with ID "project-card-{id}" where {id} is replaced with the specific project identifier.
Project cards are implemented as motion.div elements with animation capabilities.
Within each card, the media section has ID "project-media-{id}" and supports aspect ratio control and hover scale effects.
The details section contains multiple elements:
- Title with ID "project-title-{id}" and typography styles "text-lg sm:text-xl font-bold"
- Description with ID "project-description-{id}" and line-clamp functionality
- Tags container with ID "project-tags-{id}" displaying technology tags
- Links section with ID "project-links-{id}" for GitHub and demo links

The projects page includes a modal system for detailed project views:
The modal backdrop has ID "project-modal-backdrop" with backdrop blur and animation features.
Modal content uses template ID "project-modal-{id}" with responsive layout (flex-col on mobile, md:flex-row on desktop).
The modal content divides into media section (full width on mobile, 65% width on desktop) and details section (full width on mobile, 35% width on desktop).

Theme customization targets for the projects page include:
- Background: "#projects-page"
- Title: "#projects-title"
- Card elements: ".project-card", ".project-media", ".project-title", ".project-description"
- Tag elements: ".project-tag"
- Button elements: ".github-button", ".demo-button"
- Modal elements: "#project-modal-backdrop", ".project-modal", "#modal-close-button"

The projects page supports modifications for: colors, spacing, grid layout, card styling, animations, typography, and modal styling.
Animation options include hover effects (scale, shadow) and entrance animations (fade, slide).
Modal animations include open and close effects (fade, scale).


PAGE STRUCTURE: SKILLS PAGE
The skills page is identified by the ID "skills-page" and showcases technical capabilities and technologies.
The main container has ID "skills-container" with appropriate padding and maximum width constraints.
The header section has ID "skills-header" with a fade-and-slide-down animation (opacity 0 to 1, y -20px to 0px, duration 0.6s).
The header contains a title with ID "skills-title" using responsive typography and gradient styling.
The subtitle has ID "skills-subtitle" with base typography "text-neutral-400 text-base".

Skills are organized in a responsive grid with ID "skills-grid" using:
- Single column (grid-cols-1) on mobile devices
- Two columns (md:grid-cols-2) on tablet devices
- Four columns (lg:grid-cols-4) on desktop screens
- Gap spacing of "gap-8" between grid items

Each skill category follows the template ID "skill-category-{category}" implemented as motion.div elements.
Category cards have staggered fade-up animations (opacity 0 to 1, y 20px to 0px, duration 0.5s).
Category styling includes semi-transparent backgrounds (bg-neutral-900/60), backdrop blur effects, borders, and rounded corners.

Each category card has a header section with template ID "category-header-{category}" featuring:
- Gradient background from cyan-500/10 to purple-600/10
- Bottom border (border-b border-neutral-800)
- Icon container with template ID "category-icon-{category}" using gradient background and border effects
- Category title with template ID "category-title-{category}" and typography "text-2xl font-bold"

The skills list within each category has template ID "skills-list-{category}" containing individual skill items.
Each skill item follows template ID "skill-item-{name}" with staggered scale animations (opacity 0 to 1, scale 0.9 to 1).
Skill items have hover animations (y -5px) creating a float-up effect.
Each skill item contains an icon with template ID "skill-icon-{name}" and name with template ID "skill-name-{name}".

The skills page has a footer section with ID "skills-footer" featuring a fade-in animation with 0.5s delay.
The footer container has ID "skills-footer-container" with two main elements:
- A glow effect with ID "skills-footer-glow" using gradient styling (cyan-500 to purple-600) with blur and opacity effects
- Content container with ID "skills-footer-content" using semi-transparent background and backdrop blur effects

Theme customization targets for the skills page include:
- Page background: "#skills-page"
- Header elements: "#skills-title", "#skills-subtitle"
- Category elements: ".skill-category", ".category-header", ".category-icon"
- Skill elements: ".skill-item", ".skill-icon", ".skill-name"
- Footer elements: "#skills-footer-glow", "#skills-footer-content"

The skills page supports a wide range of modifications including colors, gradients, spacing, grid layout, animations, blur effects, borders, typography, and hover effects.
Animation configurations include header animations (fade-and-slide-down), category animations (staggered-fade-up with 0.1s stagger), skill animations (staggered-scale with 0.05s stagger and float-up hover effect), and footer animations (fade with 0.5s delay).


PAGE STRUCTURE: ABOUT PAGE
The about page provides personal information with ID "about-page".
It features a background with sparkles animation and a gradient overlay.
Content is centered within a container with a glass-morphism effect.
The main sections include a title, introduction, detailed descriptions, and interests (using FlipWords).
Theme customization covers background colors, gradients, sparkle properties, text colors, glass effect, animations, spacing, and typography.


COMMON FEATURES ACROSS PAGES
All pages support responsive design with mobile-first approaches.
Consistent animation patterns for entrance and interaction effects.
Shared theme customization capabilities for colors and typography.
Unified styling approach using Tailwind CSS classes.
Standardized ID naming conventions for easy targeting.
Modular component structure for maintainability.
Support for dark mode and glass-morphism effects.
Gradient and blur effects for visual enhancement.
`;

/*
// Option 2: Load content from a file (e.g., page-content.txt in the same directory)
const contentFilePath = path.join(__dirname, 'page-content.txt');
let pageContent = '';
try {
  pageContent = fs.readFileSync(contentFilePath, 'utf-8');
  console.log(`Loaded page content from ${contentFilePath}`);
} catch (err) {
  console.error(`Error loading page content from ${contentFilePath}:`, err);
  process.exit(1);
}
*/

// --- Main Embedding Function ---
async function embedAndStoreThemeStructure() {
  try {
    // --- 1. Validate API Keys ---
    if (!process.env.PINECONE_API_KEY) {
      throw new Error(
        "PINECONE_API_KEY is not defined in environment variables. Please add it to your .env file."
      );
    }
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error(
        "GOOGLE_API_KEY is not defined in environment variables. Please add it to your .env file."
      );
    }
    console.log("API keys found.");

    // --- 2. Initialize Pinecone Client ---
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    console.log("Pinecone client initialized.");

    // --- 3. Check or Create Pinecone Index ---
    console.log(`Checking if index "${INDEX_NAME}" exists...`);
    const indexes = (await pinecone.listIndexes())?.indexes ?? [];
    let indexExists = false;
    let needsWait = false;

    const existingIndex = indexes.find((index) => index.name === INDEX_NAME);

    if (existingIndex) {
      console.log(`Index "${INDEX_NAME}" already exists.`);
      if (existingIndex.dimension !== DIMENSION) {
        throw new Error(
          `Index "${INDEX_NAME}" exists but has dimension ${existingIndex.dimension}. Expected ${DIMENSION}. Please delete and recreate the index or use a different name.`
        );
      }
      indexExists = true;
    } else {
      console.log(`Index "${INDEX_NAME}" does not exist. Creating...`);
      await pinecone.createIndex({
        name: INDEX_NAME,
        dimension: DIMENSION,
        metric: "cosine", // Cosine similarity is common for text embeddings
        spec: {
          serverless: {
            cloud: "aws", // Or your preferred cloud
            region: "us-east-1", // Or your preferred region
          },
        },
      });
      console.log(
        `Index "${INDEX_NAME}" created. Waiting for initialization...`
      );
      needsWait = true;
    }

    // --- 4. Wait for Index Initialization if Newly Created ---
    if (needsWait) {
      console.log("Waiting for index to initialize (approx. 60 seconds)...");
      await new Promise((resolve) => setTimeout(resolve, 60000));
      console.log("Index should be ready.");
    }

    // Get the index object
    const index = pinecone.Index(INDEX_NAME);
    console.log(`Connected to index "${INDEX_NAME}".`);

    // --- 5. Initialize Google Embedding Model ---
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: GOOGLE_EMBEDDING_MODEL,
      // taskType: "RETRIEVAL_DOCUMENT", // Optional: Specify task type if needed by the model/Pinecone
    });
    console.log(
      `Initialized Google Embedding Model: ${GOOGLE_EMBEDDING_MODEL}`
    );

    // --- 6. Prepare Documents ---
    console.log("Splitting page content into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000, // Adjust chunk size as needed
      chunkOverlap: 100, // Adjust overlap as needed
    });
    const chunks = await splitter.splitText(pageContent);
    console.log(`Created ${chunks.length} chunks.`);

    const documents = chunks.map(
      (chunk, i) =>
        new Document({
          pageContent: chunk,
          metadata: {
            source: "theme-structure",
            chunk: i,
            content_type: "page_layout_description",
          },
        })
    );
    console.log("Created LangChain documents from chunks.");

    // --- 7. Embed and Store Documents in Pinecone ---
    console.log(
      `Embedding documents and upserting into index "${INDEX_NAME}"...`
    );

    // Optional: Clear existing vectors in the index/namespace if you want to overwrite
    // console.log(`Clearing existing vectors in index "${INDEX_NAME}"...`);
    // await index.deleteAll(); // Use with caution! Deletes all vectors in the index.
    // OR use namespace: await index.namespace("your-namespace").deleteAll();

    await PineconeStore.fromDocuments(documents, embeddings, {
      pineconeIndex: index,
      // namespace: "theme-structure" // Optional: Use a namespace if needed
      maxConcurrency: 5, // Optional: Adjust concurrency based on API limits
    });

    console.log(
      `Successfully embedded ${documents.length} documents and stored them in the "${INDEX_NAME}" index.`
    );
  } catch (error) {
    console.error("Error during theme structure embedding:", error);
    if (error instanceof Error) {
      console.error("Error Details:", error.message);
      if ("response" in error && error.response) {
        // Log more details if it's an API error response
        console.error(
          "API Response Error:",
          await (error as any).response.text()
        );
      }
    }
    process.exit(1); // Exit with error code
  }
}

// --- Run the script ---
embedAndStoreThemeStructure();
