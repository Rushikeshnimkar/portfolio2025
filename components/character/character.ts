export const characterContent = `
Rushikesh Nimkar
Full-Stack Engineer

Location: Mumbai, India
Phone: +919322675715
Email: rushikeshnimkar396@gmail.com
Portfolio: https://www.rushikeshnimkar.com/
GitHub: https://github.com/Rushikeshnimkar
LinkedIn: https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/
resume: https://www.rushikeshnimkar.com/resume
discord: https://discord.com/users/748192618659315753


Summary:
I am a full-stack developer with expertise in JavaScript, TypeScript, Java, React.js, Next.js, Spring Boot, and MySQL. Passionate about building scalable web applications with clean, maintainable code. Strong foundation in front-end development, creating responsive user interfaces, back-end integration, developing robust APIs, and database optimization for high-performance applications. Focused on delivering high-quality solutions while following best practices in software development and deployment.

Education:

C-DAC Sn-Vita, Mumbai | Post Graduate Diploma in Advanced Computing (PG-DAC) | 2025 - Present

All India Shri Shivaji Memorial Society College of Engineering (AISSMS COE), Pune | BE Computer Engineering | 2020 - 2024

Experience:
Lazarus Network | Full-Stack Engineer (Remote) | March 2024 - June 2024

Engineered secure, multi-chain Web3 interfaces for decentralized privacy platforms (Netsepio & Erebrus), implementing robust Aptos wallet integration for seamless transaction signing.

Developed and deployed "Airbot," a real-time Discord AI agent that orchestrates OpenAI and Midjourney APIs to automate generative content workflows and enhance user engagement.

Skills:

Programming Languages: JavaScript, TypeScript, Java

Libraries & Frameworks: ReactJS, Next.js, Spring Boot

Tools & Platforms: Docker, Linux, GCP

Databases: MySQL, PostgreSQL, Supabase

Projects / Open-Source:

Gitsplit (https://ethglobal.com/showcase/gitsplit-pkp5d) | Next.js, Golang, Supabase, Docker

Developed a funding platform for open-source projects using Next.js, Golang, and PostgreSQL.

Connected GitHub API for seamless project discovery and user data management.

Enhanced platform security with robust data protection measures.

Fleet Management System (Fleeman) | Java Spring Boot, Next.js, MySQL, Razorpay
GitHub: https://github.com/orgs/fleet-management-cdac/repositories

Engineered a full-stack vehicle rental platform handling 100+ hub locations with real-time inventory, dynamic pricing (monthly/weekly/daily rates), and booking workflows.

Implemented secure authentication (JWT + OAuth2), role-based access control, and Razorpay payment integration with automated invoice generation.

Built RESTful APIs with AOP logging, designed normalized database schema with 10+ tables, and enabled inter-city vehicle transfers.

Fleet Management System - Project Flow:

Architecture: The backend is built with Java Spring Boot providing RESTful APIs, and the frontend uses Next.js 14 with App Router. MySQL is the database with 10+ normalized tables. The system follows a layered architecture with Controllers, Services, Repositories, and Entity layers.

User Roles: There are three roles - Customer, Staff, and Admin. Customers can browse vehicles, make bookings, and manage their reservations. Staff members handle vehicle handovers, returns, and hub-level inventory. Admins manage staff, hubs, vehicle fleet, and system configuration.

Booking Flow:
1. Customer visits the landing page and selects pickup location (state, city, hub), return location, pickup date, and return date.
2. System queries available vehicles at the selected hub for the chosen dates, filtering out vehicles under maintenance or already booked.
3. Customer selects a vehicle and sees dynamic pricing calculated based on rental duration (daily, weekly, or monthly rates).
4. Customer fills in personal details (name, email, phone, driving license) or if logged in, details are auto-filled from their profile.
5. Customer proceeds to payment via Razorpay integration. On successful payment, a booking is created with status "CONFIRMED".
6. An automated invoice is generated and the booking appears in the customer's "My Bookings" section.

Staff Workflow:
1. Staff logs in and sees their dashboard with pending handovers and returns for their assigned hub.
2. For vehicle pickup: Staff verifies customer identity, inspects the vehicle, records odometer reading, and completes the handover. Booking status changes to "ACTIVE".
3. For vehicle return: Staff inspects the vehicle, records return odometer reading, checks for damage, calculates any late fees, and completes the return. Booking status changes to "COMPLETED".

Admin Workflow:
1. Admin can manage the entire fleet - add/remove vehicles, assign vehicles to hubs, schedule maintenance.
2. Admin manages staff accounts - create staff, assign them to specific hubs, manage permissions.
3. Admin can view analytics, booking reports, and revenue data across all hubs.
4. Admin can enable inter-city vehicle transfers between hubs.

Authentication Flow: Users register with email and password. JWT tokens are issued on login and stored in localStorage. Protected routes check authentication via AuthContext which decodes the JWT to determine user role. Incomplete profiles are automatically redirected to the profile completion page.

Technical Highlights: The frontend uses client-side route protection via layout-based checks. Error handling uses react-toastify for user-facing notifications. The service layer manually throws errors for non-2xx HTTP responses since fetch doesn't auto-throw on HTTP errors. Custom hooks like useAuth provide easy access to authentication state throughout the app.

Terminal AI Assistant (https://www.npmjs.com/package/terminal-ai-assistant) | Node.js, TypeScript, DeepSeek-V3, Commander.js

Developed a Node.js-based CLI tool to translate natural language into Windows command line instructions with DeepSeek-V3 AI.

Integrated GitHub OAuth Device Flow to enable secure authentication and one-command repository creation and pushing.

Engineered a non-blocking system using Node.js child processes to stream command outputs in real-time.

Honors & Awards:

Solana Radar Hackathon: 4th place among 200+ global teams, showcasing blockchain expertise.

Sui Overflow: Community Favorite Award for Mystic Tarot, a Web3 tarot reading platform on Sui Network.

Languages:
English, Marathi, Hindi

hobbies:
- photography
- travelling
- listening to music
- coding
`;

