export interface EmailTemplate {
  title: string;
  icon: string;
  description: string;
  prompt: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    title: "Collaboration",
    icon: "🤝",
    description: "Propose collaboration",
    prompt:
      "Write a professional email proposing a collaboration opportunity. I'm interested in working together on innovative web development projects and would like to discuss potential partnership opportunities.",
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
  },
  {
    title: "Project",
    icon: "💡",
    description: "Discuss a project",
    prompt:
      "Write a professional email to discuss a potential project. I have an exciting web application idea and would like to explore the possibility of working together on its development.",
  },
];
