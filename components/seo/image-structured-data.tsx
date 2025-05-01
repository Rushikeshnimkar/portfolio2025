export function ProfileImagesSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://rushikeshnimkar.com",
          },
          about: {
            "@type": "Person",
            name: "Rushikesh Nimkar",
            description:
              "Full Stack Developer specializing in Next.js, TypeScript, and Blockchain development.",
          },
          associatedMedia: [
            {
              "@type": "ImageObject",
              contentUrl: "https://rushikeshnimkar.com/rushikesh_nimkar.jpg",
              name: "Rushikesh Nimkar - Full Stack Developer Primary Profile",
              description:
                "Primary profile photo of Rushikesh Nimkar, Full Stack Developer",
              encodingFormat: "image/jpeg",
              width: "800",
              height: "800",
            },
            {
              "@type": "ImageObject",
              contentUrl: "https://rushikeshnimkar.com/profile.jpg",
              name: "Rushikesh Nimkar - Full Stack Developer Alternate Profile",
              description:
                "Secondary profile photo of Rushikesh Nimkar, showcasing professional appearance",
              encodingFormat: "image/jpeg",
              width: "800",
              height: "800",
            },
          ],
        }),
      }}
    />
  );
}
