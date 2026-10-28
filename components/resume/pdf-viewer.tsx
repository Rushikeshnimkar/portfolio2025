import { useState, useEffect } from "react";

export default function PDFViewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState("800px");
  const [isMobile, setIsMobile] = useState(false);

  const resumePath = "/Rushikesh_Nimkar.pdf";

  useEffect(() => {
    // Set a timeout to consider the PDF loaded after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Adjust iframe height based on screen size and check if mobile
    const updateHeight = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        const viewportHeight = window.innerHeight;
        setIframeHeight(`${viewportHeight * 0.6}px`);
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
    <div className="flex flex-col items-center w-full h-full">
      {isLoading && (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">
            Loading resume...
          </div>
        </div>
      )}

      <div
        className={`border border-neutral-800 rounded-lg overflow-hidden shadow-xl bg-neutral-900/50 backdrop-blur-sm w-full h-full ${
          isLoading ? "hidden" : ""
        }`}
      >
        {isMobile ? (
          // Mobile view with preview card
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-neutral-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">View Resume</h3>
            <p className="text-neutral-400 text-sm mb-6">
              For the best viewing experience on mobile, use the action buttons in the panel above or open directly:
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <a
                href={resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 text-center text-white"
              >
                Open in New Tab
              </a>
              <a
                href={resumePath}
                download
                className="w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors duration-200 text-center text-white"
              >
                Download PDF
              </a>
            </div>
          </div>
        ) : (
          // Desktop view with iframe
          <iframe
            src={`${resumePath}#view=FitH`}
            className="w-full rounded-md h-full min-h-[750px]"
            height={iframeHeight}
            style={{ border: "none" }}
            title="Resume PDF"
          />
        )}
      </div>
    </div>
  );
}
