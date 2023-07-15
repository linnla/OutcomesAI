import React, { useEffect } from 'react';

function GoogleTagManager() {
  useEffect(() => {
    // Define the dataLayer variable
    window.dataLayer = window.dataLayer || [];

    // Call the gtag function
    function gtag() {
      window.dataLayer.push(arguments);
    }

    // Initialize gtag
    gtag('js', new Date());
    gtag('config', 'G-1DTKYHZP6Z');
  }, []);

  return null;
}

export default GoogleTagManager;
