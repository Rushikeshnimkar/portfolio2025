// Function to detect if a message likely needs web search - optimized with Set for faster lookups
export function needsWebSearch(message: string): boolean {
    const searchIndicators = new Set([
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
        "erebrus",
        "netsepio",
        "search",
        "deepseek",
    ]);

    const lowerMessage = message.toLowerCase();
    return Array.from(searchIndicators).some((indicator) =>
        lowerMessage.includes(indicator.toLowerCase())
    );
}

// Function to detect query type - optimized with regex patterns stored as constants
const SKILLS_PATTERN =
    /skills|technologies|tech stack|programming|languages|frameworks|tools|libraries|proficient|expertise|capable|abilities/i;
const PROJECTS_PATTERN =
    /projects|portfolio|work|applications|apps|websites|developed|built|created|made|showcase|gitsplit|cryptorage|terminal ai|mystic tarot/i;
const EXPERIENCE_PATTERN =
    /experience|work history|job|career|background|employment|company|lazarus|position|role/i;
const EDUCATION_PATTERN =
    /education|degree|university|college|school|academic|study|studied|aissms|engineering|be|computer|pune/i;
const CONTACT_PATTERN =
    /contact|email|phone|reach|get in touch|connect|social media|linkedin|github|twitter|message|call/i;
const AWARDS_PATTERN =
    /awards|achievements|recognition|hackathon|solana|radar|sui|overflow|won|prize|honor/i;
const LINKS_PATTERN =
    /links|urls|websites|resources|portfolio|resume|github|linkedin|social|profiles|connect|follow|check out|visit/i;

// Add more specific patterns for individual link types
const RESUME_PATTERN = /resume|cv|curriculum vitae/i;
const GITHUB_PATTERN = /github|code|repository|repositories|source code/i;
const LINKEDIN_PATTERN = /linkedin|professional profile|professional network/i;
const PORTFOLIO_PATTERN = /portfolio website|personal website|portfolio site/i;
const PROJECT_LINKS_PATTERN =
    /project links|project urls|project websites|hackathon projects/i;

// Add more specific patterns for individual contact types
const EMAIL_PATTERN =
    /email|e-mail|mail|send.*email|send.*mail|electronic mail/i;
const PHONE_PATTERN = /phone|call|mobile|cell|telephone|contact number/i;
const LOCATION_PATTERN =
    /location|address|where.*live|where.*based|city|town|where.*from/i;
const DISCORD_PATTERN = /discord|server|chat|community/i;
// Add specific patterns for individual projects
const GITSPLIT_PATTERN =
    /gitsplit|funding platform|open-source funding|ethglobal/i;
const CRYPTORAGE_PATTERN =
    /cryptorage|chrome extension|secure storage|dorahacks|walrus blockchain/i;
const TERMINAL_AI_PATTERN =
    /terminal ai|assistant|cli tool|command line|npm package|terminal-ai-assistant/i;

// Update the detectQueryType function to handle specific project types
export function detectQueryType(message: string): string | null {
    const lowerMessage = message.toLowerCase();

    // Check for specific project types
    if (
        GITSPLIT_PATTERN.test(lowerMessage) &&
        !CRYPTORAGE_PATTERN.test(lowerMessage) &&
        !TERMINAL_AI_PATTERN.test(lowerMessage)
    )
        return "gitsplit_project";
    if (
        CRYPTORAGE_PATTERN.test(lowerMessage) &&
        !GITSPLIT_PATTERN.test(lowerMessage) &&
        !TERMINAL_AI_PATTERN.test(lowerMessage)
    )
        return "cryptorage_project";
    if (
        TERMINAL_AI_PATTERN.test(lowerMessage) &&
        !GITSPLIT_PATTERN.test(lowerMessage) &&
        !CRYPTORAGE_PATTERN.test(lowerMessage)
    )
        return "terminal_ai_project";

    // Check for specific contact types
    if (
        EMAIL_PATTERN.test(lowerMessage) &&
        !PHONE_PATTERN.test(lowerMessage) &&
        !LOCATION_PATTERN.test(lowerMessage)
    )
        return "email_contact";
    if (PHONE_PATTERN.test(lowerMessage) && !EMAIL_PATTERN.test(lowerMessage))
        return "phone_contact";
    if (LOCATION_PATTERN.test(lowerMessage)) return "location_contact";

    // Check for specific link types
    if (
        RESUME_PATTERN.test(lowerMessage) &&
        !lowerMessage.includes("skills") &&
        !lowerMessage.includes("experience")
    )
        return "resume_link";
    if (GITHUB_PATTERN.test(lowerMessage) && !lowerMessage.includes("projects"))
        return "github_link";
    if (LINKEDIN_PATTERN.test(lowerMessage)) return "linkedin_link";
    if (DISCORD_PATTERN.test(lowerMessage)) return "discord_contact";
    if (PORTFOLIO_PATTERN.test(lowerMessage)) return "portfolio_link";
    if (PROJECT_LINKS_PATTERN.test(lowerMessage)) return "project_links";

    // Then check for general categories
    if (SKILLS_PATTERN.test(lowerMessage)) return "skills";
    if (PROJECTS_PATTERN.test(lowerMessage)) return "projects";
    if (EXPERIENCE_PATTERN.test(lowerMessage)) return "experience";
    if (EDUCATION_PATTERN.test(lowerMessage)) return "education";
    if (CONTACT_PATTERN.test(lowerMessage)) return "contact";
    if (AWARDS_PATTERN.test(lowerMessage)) return "awards";
    if (LINKS_PATTERN.test(lowerMessage)) return "links";

    return null;
}
