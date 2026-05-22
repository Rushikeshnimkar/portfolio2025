import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { BaseMessage, AIMessage } from "@langchain/core/messages";
import { queryVectorStore } from "@/lib/embeddings";
import { ChatMessage, ChatResponse, OpenRouterFields, OpenRouterMessage } from "./types";
import { detectQueryType } from "./intent-detector";
import { generateStructuredResponse } from "./response-generator";

// Simple in-memory cache for vector search results
const vectorSearchCache = new Map<string, string>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Create a custom OpenRouter-based model
class OpenRouterChatModel extends ChatOpenAI {
    private isSearchQuery: boolean;

    constructor(fields: OpenRouterFields, isSearchQuery: boolean = false) {
        super(fields);
        this.isSearchQuery = isSearchQuery;
    }

    async _generate(messages: BaseMessage[]) {
        // Format messages for OpenRouter
        const formattedMessages: OpenRouterMessage[] = messages.map((msg) => ({
            role:
                msg._getType() === "human"
                    ? "user"
                    : msg._getType() === "system"
                        ? "system"
                        : "assistant",
            content: msg.content as string,
        }));

        // Check if the last message is from a human and might need search
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        if (lastMessage.role === "user" && this.isSearchQuery) {
            try {
                // Perform a search directly
                const searchTool = new TavilySearchResults({
                    maxResults: 3,
                    apiKey: process.env.TAVILY_API_KEY,
                });
                const searchResults = await searchTool.invoke(lastMessage.content);

                // Add search results as a system message
                formattedMessages.splice(formattedMessages.length - 1, 0, {
                    role: "system",
                    content: `Relevant web search results that might help with the user's question:\n${searchResults}\n\nUse these results if they're helpful for answering the question.`,
                });
            } catch (error) {
                console.error("Error performing search:", error);
                // Continue without search results if there's an error
            }
        }

        try {
            // Make direct API call to OpenRouter
            const response = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "HTTP-Referer": "https://www.rushikeshnimkar.com",
                        "X-Title": "Rushikesh's Portfolio",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "nvidia/nemotron-3-super-120b-a12b:free",
                        messages: formattedMessages,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("OpenRouter API error:", errorData);
                throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();

            // Format the response to match what LangChain expects
            return {
                generations: [
                    {
                        text: data.choices[0].message.content,
                        message: new AIMessage({
                            content: data.choices[0].message.content,
                        }),
                    },
                ],
            };
        } catch (error) {
            console.error("Error calling OpenRouter:", error);
            throw error;
        }
    }
}

// Helper to map detected intents to Pinecone metadata sections
function getSectionFilter(queryType: string | null): object | undefined {
    if (!queryType) return undefined;
    const lowerType = queryType.toLowerCase();
    if (lowerType === "skills") return { section: "skills" };
    if (lowerType === "projects" || lowerType.includes("_project")) return { section: "projects" };
    if (lowerType === "experience") return { section: "experience" };
    if (lowerType === "education") return { section: "education" };
    if (lowerType === "awards") return { section: "awards" };
    if (lowerType === "contact" || lowerType.includes("_contact") || lowerType.includes("email") || lowerType.includes("phone")) return { section: "contact" };
    return undefined;
}

export class ChatWorkflow {
    private model: OpenRouterChatModel;

    constructor(isSearchQuery: boolean = false) {
        this.model = new OpenRouterChatModel(
            {
                temperature: 0.2, // Slightly increased for more natural conversational intro
            },
            isSearchQuery
        );
    }

    // Query Transformation: Rewrite user query based on history
    private async generateSearchQuery(
        currentQuery: string,
        history: ChatMessage[]
    ): Promise<string> {
        // If no history, just return the current query
        if (history.length === 0) return currentQuery;

        // Simple heuristic: if query is very short or contains pronouns, it likely needs context
        const needsContext =
            currentQuery.length < 15 ||
            /\b(he|she|it|his|her|they|them|that|this)\b/i.test(currentQuery);

        if (!needsContext) return currentQuery;

        try {
            // Use a lightweight call to rewrite the query
            // For now, we'll just append "Rushikesh Nimkar" if it seems to be about the person
            // In a more advanced version, we'd call the LLM to rewrite it
            if (
                /\b(projects|skills|experience|contact|resume|cv)\b/i.test(currentQuery)
            ) {
                return `Rushikesh Nimkar ${currentQuery}`;
            }
            return currentQuery;
        } catch (error) {
            console.error("Error generating search query:", error);
            return currentQuery;
        }
    }

    async processMessage(
        prompt: string,
        chatHistory: ChatMessage[]
    ): Promise<ChatResponse> {
        // 1. Detect query type for structured response
        const queryType = detectQueryType(prompt);
        const structuredContent = queryType
            ? generateStructuredResponse(queryType)
            : null;

        // 2. Generate optimized search query for vector store
        const searchQuery = await this.generateSearchQuery(prompt, chatHistory);
        console.log(`Original query: "${prompt}", Search query: "${searchQuery}"`);

        // 3. Retrieve context from vector store using Section-Based Metadata Filtering
        let characterInfo = "";
        const cacheKey = `vector_search_${searchQuery.toLowerCase().trim()}`;

        if (vectorSearchCache.has(cacheKey)) {
            console.log("Using cached vector search results");
            characterInfo = vectorSearchCache.get(cacheKey)!;
        } else {
            try {
                console.time("Vector search");
                const k = searchQuery.length > 50 ? 4 : 3;
                const filter = getSectionFilter(queryType);

                let relevantInfo: { pageContent: string }[] = [];
                // Phase A: Try metadata-filtered retrieval
                if (filter) {
                    console.log(`Attempting metadata-guided RAG search with section:`, filter);
                    relevantInfo = await queryVectorStore(searchQuery, k, filter);
                }

                // Phase B: Unfiltered fallback search if results are sparse or no filter was resolved
                if (relevantInfo.length < 2) {
                    console.log("Metadata-filtered search returned sparse results or no filter. Falling back to unfiltered search.");
                    relevantInfo = await queryVectorStore(searchQuery, k);
                }
                console.timeEnd("Vector search");

                characterInfo = relevantInfo.map((doc) => doc.pageContent).join("\n\n");

                // Cache the results
                vectorSearchCache.set(cacheKey, characterInfo);
                setTimeout(() => {
                    vectorSearchCache.delete(cacheKey);
                }, CACHE_TTL);
            } catch (error) {
                console.error("Vector search failed, using fallback:", error);
                characterInfo = "";
            }
        }

        // 4. Construct System Prompt - OPTIMIZED FOR SMALL MODELS
        let systemContent = `<identity>
You are Rushikesh Nimkar, an SDE 1 Software Engineer specializing in Java, React.js, Next.js, and MySQL. Speak directly in the FIRST PERSON ("I", "my").
</identity>

<context>
${characterInfo ? `Here is the verified information about my profile and projects:\n${characterInfo}` : "No verified profile information found."}
</context>

<instructions>
1. Always maintain a professional SDE persona.
2. Keep responses brief, crisp, and conversational (under 2-3 sentences).
3. If structured card UI is active (structuredContent present), DO NOT repeat or list details already shown in the card. Talk about what excites me, my passion, or provide a brief welcoming introduction.
4. If unsure or if asked about details not present in the verified context, say "Feel free to contact me directly for more details!" and do not hallucinate facts.
</instructions>`;

        if (structuredContent) {
            systemContent += `\n\n<ui_guidelines>
A beautiful interactive ${queryType?.replace("_", " ")} card is displayed to the user right next to your response containing all raw lists, technologies, and URLs.
Provide a brief, charming, conversational companion text. Avoid repeating names, numbers, links, or bulleted items from the card.
</ui_guidelines>`;
        }

        // 5. Call LLM
        const messages = [
            { role: "system", content: systemContent },
            ...chatHistory.map((msg) => ({
                role: msg.type,
                content: msg.content,
            })),
            { role: "user", content: prompt },
        ];

        // We need to convert our simple message format to LangChain's BaseMessage format
        // for the _generate method we implemented in OpenRouterChatModel
        const langChainMessages = messages.map((msg) => {
            if (msg.role === "user") return { _getType: () => "human", content: msg.content } as BaseMessage;
            if (msg.role === "system") return { _getType: () => "system", content: msg.content } as BaseMessage;
            return { _getType: () => "ai", content: msg.content } as BaseMessage;
        });

        const response = await this.model._generate(langChainMessages);
        const content = response.generations[0].text;

        return {
            content,
            structuredContent: structuredContent || undefined,
        };
    }
}
