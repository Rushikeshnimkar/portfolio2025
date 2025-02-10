export function PersonSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Rushikesh Nimkar",
          url: "https://rushikeshnimkar.com",
          sameAs: [
            "https://github.com/Rushikeshnimkar",
            "https://www.linkedin.com/in/rushikesh-nimkar-0961361ba/",
            "https://x.com/RushikeshN22296"
          ],
          jobTitle: "Full Stack Developer",
          knowsAbout: ["Web Development", "Blockchain", "TypeScript", "React", "Next.js"],
          image: "/profile.jpg",
          description: "Full Stack Developer specializing in Next.js, TypeScript, and Blockchain development."
        })
      }}
    />
  );
} 