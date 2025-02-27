/* eslint-disable */
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { MemorySaver } from "@langchain/langgraph";
import { characterContent } from "@/lib/character";

// Add CORS check middleware
function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = [
    "https://rushikeshnimkar.xyz",
    "https://www.rushikeshnimkar.xyz",
    // Include localhost for development
    // "http://localhost:3000",
  ];
  return origin && allowedOrigins.includes(origin);
}

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();

// Function to detect if a message likely needs web search
function needsWebSearch(message: string): boolean {
  const searchIndicators = [
    "current",
    "latest",
    "recent",
    "news",
    "today",
    "update",
    "weather",
    "price",
    "stock",
    "event",
    "happened",
    "when did",
    "when will",
    "how much is",
    "what is the",
    "who is",
    "where is",
    "2023",
    "2024",
    "2025",
    "sui",
    "solana",
    "erebrus.io",
    "erebrus",
    "netsepio",
    "netsepio.com",
    "search",
    "deepseek",
  ];

  return searchIndicators.some((indicator) =>
    message.toLowerCase().includes(indicator.toLowerCase())
  );
}

// Define types for OpenRouter API
interface OpenRouterMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface OpenRouterFields {
  temperature?: number;
  [key: string]: unknown;
}

// Create a custom OpenRouter-based model
class OpenRouterChatModel extends ChatOpenAI {
  private isSearchQuery: boolean;

  constructor(fields: OpenRouterFields, isSearchQuery: boolean = false) {
    super(fields);
    this.isSearchQuery = isSearchQuery;
  }

  async _generate(messages: BaseMessage[], _options: ChatOpenAICallOptions) {
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
            "HTTP-Referer": "https://rushikeshnimkar.xyz",
            "X-Title": "Rushikesh's Portfolio",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-70b-instruct", // Using Llama 3.1 70B
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

// Define the type for chat history messages
interface ChatMessage {
  type: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  // Check origin
  const headersList = await headers();
  const origin = headersList.get("origin");

  // If origin is not allowed, return 403 Forbidden
  if (!isAllowedOrigin(origin)) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized origin" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const {
      prompt,
      messages: chatHistory,
      sessionId,
    } = (await req.json()) as {
      prompt: string;
      messages: ChatMessage[];
      sessionId?: string;
    };

    console.log("Received request with prompt:", prompt);

    // Check if the prompt likely needs web search
    const isSearchQuery = needsWebSearch(prompt);

    // Create a model with the search flag
    const model = new OpenRouterChatModel(
      {
        temperature: 0,
      },
      isSearchQuery
    );

    // Define the function that calls the model with context
    async function callModel(state: typeof MessagesAnnotation.State) {
      try {
        // Add system message with context about Rushikesh
        const systemContent = `You are Rushikesh Nimkar and an AI version of Rushikesh made by Rushikesh. Keep responses short and use "I" statements.
        
        Content about Rushikesh: ${characterContent}
        
        Rules:
        1. Speak as Rushikesh using "I" and "my"
        2. Focus on skills and projects
        3. If unsure, say "Contact me directly"
        4. Use web search results when provided to give up-to-date information
        5. Always maintain Rushikesh's persona`;

        // Add system message to the beginning if it doesn't exist
        if (
          state.messages.length === 0 ||
          !(state.messages[0] instanceof SystemMessage)
        ) {
          state.messages.unshift(new SystemMessage(systemContent));
        }

        console.log("Calling model with messages");
        const response = await model._generate(state.messages, {});
        console.log("Model response received");

        // We return a list, because this will get added to the existing list
        return { messages: [response.generations[0].message] };
      } catch (error) {
        console.error("Error in callModel:", error);
        // Return a fallback message
        return {
          messages: [
            new AIMessage(
              "I'm sorry, I encountered an error processing your request. Please try again later."
            ),
          ],
        };
      }
    }

    // Define a new graph
    const workflow = new StateGraph(MessagesAnnotation)
      .addNode("agent", callModel)
      .addEdge("__start__", "agent")
      .addEdge("agent", "__end__");

    // Compile it into a LangChain Runnable with the checkpointer
    const app = workflow.compile({
      checkpointer: agentCheckpointer,
    });

    // Convert chat history to the format expected by LangGraph
    const formattedMessages = chatHistory
      ? chatHistory.map((msg: ChatMessage) =>
          msg.type === "user"
            ? new HumanMessage(msg.content)
            : new AIMessage(msg.content)
        )
      : [];

    // Add the current prompt as a human message
    formattedMessages.push(new HumanMessage(prompt));
    console.log("Formatted messages prepared");

    // Generate a thread ID for this conversation
    // Use the provided sessionId or generate a new one
    const threadId = sessionId || Date.now().toString();

    // Use the agent
    console.log("Invoking agent workflow with thread ID:", threadId);
    const finalState = await app.invoke(
      { messages: formattedMessages },
      { configurable: { thread_id: threadId } }
    );
    console.log("Agent workflow completed");

    // Get the last message (the response)
    const response =
      finalState.messages[finalState.messages.length - 1].content;

    // Return response with CORS headers and include isSearchPerformed flag and threadId
    return new NextResponse(
      JSON.stringify({
        response,
        isSearchPerformed: isSearchQuery,
        sessionId: threadId, // Return the thread ID to the client
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const headersList = headers();
  const origin = (await headersList).get("origin");

  if (!isAllowedOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": origin || "",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
