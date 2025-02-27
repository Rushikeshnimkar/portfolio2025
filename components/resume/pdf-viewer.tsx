import { useState, useEffect } from "react";

export default function PDFViewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState("800px");

  const resumePath = "/Rushikesh_Nimkar.pdf";

  useEffect(() => {
    // Set a timeout to consider the PDF loaded after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Adjust iframe height based on screen size
    const updateHeight = () => {
      if (window.innerWidth < 768) {
        setIframeHeight("500px");
      } else {
        setIframeHeight("800px");
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {isLoading && (
        <div className="w-full max-w-2xl h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">
            Loading resume...
          </div>
        </div>
      )}

      <div
        className={`border border-neutral-800 rounded-lg overflow-hidden shadow-xl bg-neutral-900/50 backdrop-blur-sm w-full max-w-2xl ${
          isLoading ? "hidden" : ""
        }`}
      >
        <iframe
          src={`${resumePath}#view=FitH`}
          className="w-full rounded-md"
          height={iframeHeight}
          style={{ border: "none" }}
          title="Resume PDF"
        />
      </div>

      <div className="mt-6 flex space-x-4">
        <a
          href={resumePath}
          download
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:shadow-lg transition-all duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 13.586V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Download Resume
        </a>

        <a
          href={resumePath}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-all duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          Open in New Tab
        </a>
      </div>
    </div>
  );
}
