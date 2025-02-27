export interface EmailTemplate {
  title: string;
  icon: string;
  description: string;
  prompt: string;
  tags: string[];
}

export const emailTemplates: EmailTemplate[] = [
  {
    title: "Professional Introduction",
    icon: "👔",
    description: "A formal introduction for business inquiries and networking.",
    prompt:
      "Generate a professional email introducing myself as a software developer looking to connect with potential clients or employers. Include my expertise in React, Next.js, and TypeScript.",
    tags: ["Business", "Formal"],
  },
  {
    title: "Project Proposal",
    icon: "📊",
    description: "Outline a project idea or proposal to a potential client.",
    prompt:
      "Create a project proposal email for a potential client. The project involves building a modern web application with React and Next.js. Include sections about timeline, approach, and why I'm the right developer for the job.",
    tags: ["Proposal", "Business"],
  },
  {
    title: "Follow-up Message",
    icon: "🤝",
    description: "A friendly follow-up after a meeting or interview.",
    prompt:
      "Write a follow-up email after a job interview for a frontend developer position. Express gratitude for the opportunity, reiterate my interest, and briefly mention a key point from our conversation.",
    tags: ["Follow-up", "Networking"],
  },
  {
    title: "Collaboration",
    icon: "🤝",
    description: "Propose collaboration",
    prompt:
      "Write a professional email proposing a collaboration opportunity. I'm interested in working together on innovative web development projects and would like to discuss potential partnership opportunities.",
    tags: ["Collaboration", "Business"],
  },
  {
    title: "Hire Me",
    icon: "💼",
    description: "Recruitment inquiry",
    prompt: `Write a professional email as a tech recruiter reaching out to hire Rushikesh Nimkar. Include these details:
  
  My name is [Your Name]
  Position: Technical Recruiter
  Company: [Company Name]
  Email: [Your Email]
  Location: [City, Country] (Remote/Hybrid/On-site)
  
  Role Details:
  - Position: Full Stack Developer
  - Level: [Junior/Mid/Senior]
  - Tech Stack: React, TypeScript, Node.js, Blockchain
  - Salary Range: [Amount] per year
  - Benefits: Health insurance, stock options, flexible hours, etc.
  
  I've reviewed your portfolio projects (CryptoRage and GitSplit) and your experience with modern web technologies and blockchain development aligns perfectly with what we're looking for. Let's schedule a call to discuss this opportunity in detail.`,
    tags: ["Recruitment", "Business"],
  },
  {
    title: "Project",
    icon: "💡",
    description: "Discuss a project",
    prompt:
      "Write a professional email to discuss a potential project. I have an exciting web application idea and would like to explore the possibility of working together on its development.",
    tags: ["Project", "Business"],
  },
];
