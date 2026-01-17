import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Skills database for matching
const PORTFOLIO_SKILLS = {
    "JavaScript": { proficiency: "Expert", years: 3 },
    "TypeScript": { proficiency: "Advanced", years: 2 },
    "React": { proficiency: "Expert", years: 3 },
    "React.js": { proficiency: "Expert", years: 3 },
    "Next.js": { proficiency: "Advanced", years: 2 },
    "Node.js": { proficiency: "Advanced", years: 2 },
    "Golang": { proficiency: "Intermediate", years: 1 },
    "Go": { proficiency: "Intermediate", years: 1 },
    "Java": { proficiency: "Intermediate", years: 2 },
    "Python": { proficiency: "Intermediate", years: 1 },
    "HTML": { proficiency: "Expert", years: 4 },
    "CSS": { proficiency: "Expert", years: 4 },
    "Tailwind": { proficiency: "Advanced", years: 2 },
    "MySQL": { proficiency: "Advanced", years: 2 },
    "PostgreSQL": { proficiency: "Intermediate", years: 1 },
    "MongoDB": { proficiency: "Intermediate", years: 1 },
    "Docker": { proficiency: "Intermediate", years: 1 },
    "AWS": { proficiency: "Intermediate", years: 1 },
    "AWS EC2": { proficiency: "Intermediate", years: 1 },
    "Google Cloud": { proficiency: "Intermediate", years: 1 },
    "GCP": { proficiency: "Intermediate", years: 1 },
    "Git": { proficiency: "Advanced", years: 3 },
    "GitHub": { proficiency: "Advanced", years: 3 },
    "GitHub Actions": { proficiency: "Intermediate", years: 1 },
    "CI/CD": { proficiency: "Intermediate", years: 1 },
    "REST API": { proficiency: "Advanced", years: 2 },
    "GraphQL": { proficiency: "Beginner", years: 0.5 },
    "Blockchain": { proficiency: "Intermediate", years: 1 },
    "Web3": { proficiency: "Intermediate", years: 1 },
    "Solana": { proficiency: "Intermediate", years: 1 },
    "Sui": { proficiency: "Beginner", years: 0.5 },
    "Express": { proficiency: "Advanced", years: 2 },
    "Express.js": { proficiency: "Advanced", years: 2 },
    "Full Stack": { proficiency: "Advanced", years: 2 },
    "Frontend": { proficiency: "Expert", years: 3 },
    "Backend": { proficiency: "Advanced", years: 2 },
};

// Skill aliases for better matching
const SKILL_ALIASES: Record<string, string> = {
    "reactjs": "React",
    "react js": "React",
    "nodejs": "Node.js",
    "node js": "Node.js",
    "node": "Node.js",
    "nextjs": "Next.js",
    "next js": "Next.js",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "golang": "Golang",
    "amazon web services": "AWS",
    "ec2": "AWS EC2",
    "gcp": "Google Cloud",
    "google cloud platform": "Google Cloud",
    "tailwindcss": "Tailwind",
    "tailwind css": "Tailwind",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mongo": "MongoDB",
    "expressjs": "Express.js",
    "express js": "Express.js",
    "fullstack": "Full Stack",
    "full-stack": "Full Stack",
};

function normalizeSkill(skill: string): string {
    const lower = skill.toLowerCase().trim();
    return SKILL_ALIASES[lower] || skill;
}

function extractSkillsFromText(text: string): string[] {
    // Common skill patterns
    const skillPatterns = [
        /\b(react|react\.js|reactjs)\b/gi,
        /\b(node|node\.js|nodejs)\b/gi,
        /\b(next|next\.js|nextjs)\b/gi,
        /\b(typescript|ts)\b/gi,
        /\b(javascript|js)\b/gi,
        /\b(python)\b/gi,
        /\b(java)\b/gi,
        /\b(golang|go)\b/gi,
        /\b(aws|amazon web services|ec2)\b/gi,
        /\b(gcp|google cloud)\b/gi,
        /\b(docker)\b/gi,
        /\b(kubernetes|k8s)\b/gi,
        /\b(mysql)\b/gi,
        /\b(postgresql|postgres)\b/gi,
        /\b(mongodb|mongo)\b/gi,
        /\b(graphql)\b/gi,
        /\b(rest api|restful)\b/gi,
        /\b(git|github)\b/gi,
        /\b(ci\/cd|cicd)\b/gi,
        /\b(tailwind|tailwindcss)\b/gi,
        /\b(html|css)\b/gi,
        /\b(blockchain|web3|solana|sui)\b/gi,
        /\b(express|express\.js)\b/gi,
        /\b(full[ -]?stack|fullstack)\b/gi,
        /\b(frontend|front[ -]?end)\b/gi,
        /\b(backend|back[ -]?end)\b/gi,
    ];

    const extracted = new Set<string>();

    for (const pattern of skillPatterns) {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const normalized = normalizeSkill(match);
                extracted.add(normalized);
            });
        }
    }

    return Array.from(extracted);
}

function isAllowedOrigin(origin: string | null) {
    const allowedOrigins = [
        "https://www.rushikeshnimkar.com",
        "https://www.www.rushikeshnimkar.com",
        // "http://localhost:3000",
    ];
    return origin && allowedOrigins.includes(origin);
}

export async function POST(req: Request) {
    const headersList = await headers();
    const origin = headersList.get("origin");

    if (!isAllowedOrigin(origin)) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized origin" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const { requirements } = await req.json();

        if (!requirements || typeof requirements !== "string") {
            return NextResponse.json(
                { error: "Requirements text is required" },
                { status: 400 }
            );
        }

        // Extract skills from the requirements
        const requestedSkills = extractSkillsFromText(requirements);

        if (requestedSkills.length === 0) {
            return NextResponse.json({
                matchPercentage: 0,
                matchedSkills: [],
                missingSkills: [],
                summary: "I couldn't identify specific skills in your description. Try mentioning technologies like React, Node.js, AWS, etc.",
                recommendation: "Please provide a job description or list of required skills for analysis.",
            });
        }

        // Match against portfolio skills
        const matchedSkills: Array<{ name: string; matched: boolean; proficiency?: string }> = [];
        const missingSkills: Array<{ name: string; matched: boolean }> = [];

        for (const skill of requestedSkills) {
            const portfolioSkill = PORTFOLIO_SKILLS[skill as keyof typeof PORTFOLIO_SKILLS];

            if (portfolioSkill) {
                matchedSkills.push({
                    name: skill,
                    matched: true,
                    proficiency: `${portfolioSkill.proficiency} - ${portfolioSkill.years}+ yr${portfolioSkill.years !== 1 ? "s" : ""}`,
                });
            } else {
                missingSkills.push({
                    name: skill,
                    matched: false,
                });
            }
        }

        // Calculate match percentage
        const matchPercentage = Math.round(
            (matchedSkills.length / requestedSkills.length) * 100
        );

        // Generate summary based on match
        let summary = "";
        let recommendation = "";

        if (matchPercentage >= 80) {
            summary = `Excellent match! I have strong experience with ${matchedSkills.length} out of ${requestedSkills.length} required skills. My background in full-stack development with React, Node.js, and cloud technologies aligns very well with these requirements.`;
            recommendation = "I'd be a strong candidate for this role. Let's connect to discuss further!";
        } else if (matchPercentage >= 60) {
            summary = `Good match! I have experience with ${matchedSkills.length} out of ${requestedSkills.length} skills. My core strengths in JavaScript, React, and backend development provide a solid foundation.`;
            recommendation = "I'm open to learning the additional technologies quickly. Happy to discuss how my experience translates.";
        } else if (matchPercentage >= 40) {
            summary = `Partial match with ${matchedSkills.length} out of ${requestedSkills.length} skills. While I have foundational knowledge in some areas, this role would require some upskilling.`;
            recommendation = "Consider checking out my projects to see my learning ability and adaptability.";
        } else {
            summary = `This role requires skills that differ from my current expertise. I matched ${matchedSkills.length} out of ${requestedSkills.length} requirements.`;
            recommendation = "Feel free to reach out if you have other roles that might be a better fit!";
        }

        return NextResponse.json({
            matchPercentage,
            matchedSkills,
            missingSkills,
            summary,
            recommendation,
        });
    } catch (error) {
        console.error("Error analyzing skills:", error);
        return NextResponse.json(
            { error: "Failed to analyze skills" },
            { status: 500 }
        );
    }
}
