import React from 'react';
import GoogleTagManager from './GoogleTagManager';

function WebPageLayout({ children, title, metaTags }) {
  return (
    <div>
      <head>
        <title>{title}</title>
        {/* Add other meta tags */}
        {metaTags &&
          metaTags.map((tag, index) => <meta key={index} {...tag} />)}
      </head>
      <header>{/* Add your header content */}</header>
      <main>{children}</main>
      <footer className='footer'>
        {' '}
        {/* Add the 'footer' class */}
        &copy; {new Date().getFullYear()} CloudRaiders LLC. All rights reserved.
      </footer>
      <GoogleTagManager />
    </div>
  );
}

export default WebPageLayout;
