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
    <div className="flex flex-col items-center w-full">
      {isLoading && (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">
            Loading resume...
          </div>
        </div>
      )}

      <div
        className={`border border-neutral-800 rounded-lg overflow-hidden shadow-xl bg-neutral-900/50 backdrop-blur-sm w-full ${
          isLoading ? "hidden" : ""
        }`}
      >
        {isMobile ? (
          // Mobile view with preview image and call-to-action
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
              For the best viewing experience on mobile, please choose one of
              the options below:
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <a
                href={resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 text-center"
              >
                Open in New Tab
              </a>
              <a
                href={resumePath}
                download
                className="w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors duration-200 text-center"
              >
                Download PDF
              </a>
            </div>
          </div>
        ) : (
          // Desktop view with iframe
          <iframe
            src={`${resumePath}#view=FitH`}
            className="w-full rounded-md"
            height={iframeHeight}
            style={{ border: "none" }}
            title="Resume PDF"
          />
        )}
      </div>

      {!isMobile && (
        <div className="mt-6 flex flex-row gap-3 space-x-4 px-4 sm:px-0">
          <a
            href={resumePath}
            download
            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2"
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
            className="px-4 sm:px-6 py-1.5 sm:py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            Open in New Tab
          </a>
        </div>
      )}
    </div>
  );
}
