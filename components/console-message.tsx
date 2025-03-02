'use client';

import { useEffect } from 'react';

const ConsoleMessage = () => {
  useEffect(() => {
    const styles = {
      title: [
        'color: #3b82f6',
        'font-size: 24px',
        'font-weight: bold',
        'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2)',
        'padding: 10px',
      ].join(';'),
      
      message: [
        'color: #10b981',
        'font-size: 14px',
        'font-weight: normal',
        'padding: 5px',
      ].join(';'),
      
      warning: [
        'color: #ef4444',
        'font-size: 12px',
        'font-weight: bold',
        'padding: 5px',
      ].join(';'),
    };

    console.clear();
    console.log('%cHey, Rushikesh here! 👋', styles.title);
    console.log('%c🚀 Welcome to my portfolio!', styles.message);
    console.log('%c💻 Feel free to explore the code.', styles.message);
    console.log('%c⚡ Built with Next.js, TypeScript, and Tailwind CSS', styles.message);
    console.log('%c🔥 Want to collaborate? Contact me!', styles.message);
    console.log('%c⚠️ This is a protected website. Please respect the code.', styles.warning);
    console.log('%c🔒 Automated clicks are not allowed.', styles.warning);
  }, []);

  return null;
};

export default ConsoleMessage; 