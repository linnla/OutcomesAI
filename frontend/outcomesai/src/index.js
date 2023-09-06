import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';
import { awsConfig } from './config/Config';
import { LicenseInfo } from '@mui/x-license-pro';
import { UserProvider } from './contexts/UserContext';

Amplify.configure(awsConfig);
LicenseInfo.setLicenseKey(
  '30967ef1cc2c7223ef730b9ce25d9c1bTz03MjU2NixFPTE3MjMzOTY2OTUwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y'
);

const MemoizedApp = React.memo(App); // <-- Place the memoization here

// 1) Get a reference to the div with ID root
const el = document.getElementById('root');

// 2) Tell React to take control of that element
const root = ReactDOM.createRoot(el);

// 3) Show the component on the screen
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <MemoizedApp /> {/* <-- Use the memoized component here */}
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
