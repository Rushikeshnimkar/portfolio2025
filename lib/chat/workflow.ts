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
                        model: "mistralai/devstral-2512:free",
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

export class ChatWorkflow {
    private model: OpenRouterChatModel;

    constructor(isSearchQuery: boolean = false) {
        this.model = new OpenRouterChatModel(
            {
                temperature: 0,
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

        // 3. Retrieve context from vector store
        let characterInfo = "";
        const cacheKey = `vector_search_${searchQuery.slice(0, 50)}`;

        if (vectorSearchCache.has(cacheKey)) {
            console.log("Using cached vector search results");
            characterInfo = vectorSearchCache.get(cacheKey)!;
        } else {
            try {
                console.time("Vector search");
                // Adjust number of results based on query complexity
                const k = searchQuery.length > 50 ? 4 : 3;
                const relevantInfo = await queryVectorStore(searchQuery, k);
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

        // 4. Construct System Prompt
        let systemContent = `You are Rushikesh Nimkar, a full-stack developer with expertise in Java, React.js, Next.js, and MySQL.`;

        if (structuredContent) {
            systemContent += ` For this query, provide a VERY BRIEF conversational introduction only. DO NOT list specific details like skills, projects, contact info, or links - these will be displayed separately in a structured format. Keep your response to 1-2 sentences maximum.`;
        } else {
            systemContent += ` Keep responses concise and use "I" statements.`;
        }

        if (characterInfo) {
            systemContent += `\n\nRelevant information about me:\n${characterInfo}`;
        }

        // Add specific instructions based on query type
        if (queryType) {
            systemContent += `\n\nThis question is about my ${queryType.replace(
                "_",
                " "
            )}. Just provide a brief introduction - the details will be shown in a structured format.`;
        }

        systemContent += `\n\nRules:
    1. Speak as Rushikesh using "I" and "my"
    2. Keep responses concise and focused
    3. If unsure about specific details, say "Feel free to contact me directly for more information"
    4. Use web search results when provided for up-to-date information
    5. Maintain a professional tone`;

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
