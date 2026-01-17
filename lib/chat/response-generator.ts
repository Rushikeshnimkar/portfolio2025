import { StructuredContent } from "./types";

// Update the generateStructuredResponse function to handle specific project types
export function generateStructuredResponse(queryType: string): StructuredContent | null {
    // Define individual project templates
    const projectTemplates: Record<string, { title: string; description: string; technologies: string[]; link: string }[]> = {
        gitsplit_project: [
            {
                title: "Gitsplit",
                description:
                    "A funding platform for open-source projects using Next.js, Golang, and PostgreSQL.",
                technologies: ["Next.js", "Golang", "PostgreSQL", "GitHub API"],
                link: "https://ethglobal.com/showcase/gitsplit-pkp5d",
            },
        ],
        cryptorage_project: [
            {
                title: "Cryptorage",
                description:
                    "Chrome extension using React.js and Supabase for secure data storage with blockchain integration.",
                technologies: [
                    "React.js",
                    "Supabase",
                    "Walrus Blockchain",
                    "OCR",
                    "Gemini Nano",
                ],
                link: "https://dorahacks.io/buidl/16435",
            },
        ],
        terminal_ai_project: [
            {
                title: "Terminal AI Assistant",
                description:
                    "Node.js CLI tool that converts natural language into Windows command line instructions.",
                technologies: ["Node.js", "DeepSeek-V3 AI", "CLI"],
                link: "https://www.npmjs.com/package/terminal-ai-assistant",
            },
        ],
    };

    // Define individual contact templates
    const contactTemplates: Record<string, { email?: string; phone?: string; location?: string; discord?: string; type: string }> = {
        email_contact: {
            email: "rushikeshnimkar396@gmail.com",
            type: "Email",
        },
        phone_contact: {
            phone: "+919322675715",
            type: "Phone",
        },
        location_contact: {
            location: "Nagpur",
            type: "Location",
        },
        discord_contact: {
            discord: "https://discord.com/users/748192618659315753",
            type: "Discord",
        },
    };

    // Define individual link templates
    const linkTemplates: Record<string, { title: string; url: string; description: string }[]> = {
        resume_link: [
            {
                title: "Resume",
                url: "https://www.rushikeshnimkar.com/resume",
                description:
                    "View my detailed resume with skills, experience, and education",
            },
        ],
        github_link: [
            {
                title: "GitHub Profile",
                url: "https://github.com/Rushikeshnimkar",
                description:
                    "Check out my code repositories and open-source contributions",
            },
        ],
        linkedin_link: [
            {
                title: "LinkedIn Profile",
                url: "https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/",
                description: "Connect with me professionally on LinkedIn",
            },
        ],
        discord_link: [
            {
                title: "Discord Server",
                url: "https://discord.com/users/748192618659315753",
                description: "Join my Discord community",
            },
        ],
        portfolio_link: [
            {
                title: "Portfolio Website",
                url: "https://www.rushikeshnimkar.com",
                description: "My personal portfolio showcasing projects and skills",
            },
        ],
        project_links: [
            {
                title: "Gitsplit Project",
                url: "https://ethglobal.com/showcase/gitsplit-pkp5d",
                description: "Funding platform for open-source projects",
            },
            {
                title: "Cryptorage Project",
                url: "https://dorahacks.io/buidl/16435",
                description: "Chrome extension for secure data storage",
            },
            {
                title: "Terminal AI Assistant",
                url: "https://www.npmjs.com/package/terminal-ai-assistant",
                description: "CLI tool for natural language command conversion",
            },
        ],
    };

    // Define the structured data templates for general categories
    const structuredDataTemplates: Record<string, unknown> = {
        skills: [
            { name: "JavaScript", category: "Programming Language" },
            { name: "Java", category: "Programming Language" },
            { name: "React.js", category: "Frontend Framework" },
            { name: "Next.js", category: "Frontend Framework" },
            { name: "TypeScript", category: "Programming Language" },
            { name: "Node.js", category: "Backend" },
            { name: "MySQL", category: "Database" },
            { name: "PostgreSQL", category: "Database" },
            { name: "Docker", category: "DevOps" },
            { name: "Git", category: "Version Control" },
            { name: "AWS EC2", category: "Cloud" },
            { name: "Google Cloud", category: "Cloud" },
        ],
        projects: [
            {
                title: "Gitsplit",
                description:
                    "A funding platform for open-source projects using Next.js, Golang, and PostgreSQL.",
                technologies: ["Next.js", "Golang", "PostgreSQL", "GitHub API"],
                link: "https://ethglobal.com/showcase/gitsplit-pkp5d",
            },
            {
                title: "Cryptorage",
                description:
                    "Chrome extension using React.js and Supabase for secure data storage with blockchain integration.",
                technologies: [
                    "React.js",
                    "Supabase",
                    "Walrus Blockchain",
                    "OCR",
                    "Gemini Nano",
                ],
                link: "https://dorahacks.io/buidl/16435",
            },
            {
                title: "Terminal AI Assistant",
                description:
                    "Node.js CLI tool that converts natural language into Windows command line instructions.",
                technologies: ["Node.js", "DeepSeek-V3 AI", "CLI"],
                link: "https://www.npmjs.com/package/terminal-ai-assistant",
            },
        ],
        experience: [
            {
                title: "Full-Stack Engineer",
                company: "Lazarus Network Inc.",
                period: "Feb 2024 - Feb 2025",
                description:
                    "Developed frontend with Next.js and React.js, backend with Node.js. Managed AWS EC2 and Google Cloud servers. Added multichain support to Erebrus and developed Netsepio frontend.",
            },
        ],
        education: [
            {
                title: "BE Computer Engineering",
                institution: "AISSMS COE, Pune",
                period: "2020 - 2024",
                description: "Bachelor's degree in Computer Engineering",
            },
            {
                title: "12th Grade",
                institution: "DR. M.K. UMATHE COLLEGE, Nagpur",
                period: "2019 - 2020",
                description: "Higher secondary education",
            },
            {
                title: "10th Grade",
                institution: "SCHOOL OF SCHOLARS, Nagpur",
                period: "2017 - 2018",
                description: "Secondary education",
            },
        ],
        contact: {
            email: "rushikeshnimkar396@gmail.com",
            phone: "+919322675715",
            location: "Nagpur",
            linkedin: "https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/",
            github: "https://github.com/Rushikeshnimkar",
            discord: "https://discord.com/users/748192618659315753",
            portfolio: "https://www.rushikeshnimkar.com/",
        },
        awards: [
            {
                title: "Solana Radar Hackathon 2024",
                description:
                    "Achieved 4th place out of 200+ global teams, demonstrating expertise in blockchain technology and innovative problem-solving.",
            },
            {
                title: "Sui Overflow 2024",
                description:
                    "Awarded the Community Favorite Award for Mystic Tarot, an innovative Web3 tarot reading platform on the Sui Network.",
            },
        ],
        links: [
            {
                title: "Portfolio Website",
                url: "https://www.rushikeshnimkar.com",
                description: "My personal portfolio showcasing projects and skills",
            },
            {
                title: "Resume",
                url: "https://www.rushikeshnimkar.com/resume",
                description: "View my detailed resume",
            },
            {
                title: "GitHub Profile",
                url: "https://github.com/Rushikeshnimkar",
                description: "Check out my code repositories and contributions",
            },
            {
                title: "LinkedIn",
                url: "https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/",
                description: "Connect with me professionally",
            },
            {
                title: "Gitsplit Project",
                url: "https://ethglobal.com/showcase/gitsplit-pkp5d",
                description: "Funding platform for open-source projects",
            },
            {
                title: "Cryptorage Project",
                url: "https://dorahacks.io/buidl/16435",
                description: "Chrome extension for secure data storage",
            },
            {
                title: "Terminal AI Assistant",
                url: "https://www.npmjs.com/package/terminal-ai-assistant",
                description: "CLI tool for natural language command conversion",
            },
        ],
    };

    // Check if it's a specific project type
    if (queryType.includes("_project")) {
        return {
            type: "projects",
            data: projectTemplates[queryType],
        };
    }

    // Check if it's a specific contact type
    if (queryType.includes("_contact")) {
        return {
            type: "contact",
            data: contactTemplates[queryType],
        };
    }

    // Check if it's a specific link type
    if (queryType.includes("_link")) {
        return {
            type: "links",
            data: linkTemplates[queryType],
        };
    }

    // Otherwise return the general category data
    if (structuredDataTemplates[queryType]) {
        return {
            type: queryType,
            data: structuredDataTemplates[queryType],
        };
    }

    return null;
}
