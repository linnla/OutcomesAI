import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import { awsConfig } from './config/Config';
import './styles/global.css';

Amplify.configure(awsConfig);

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
root.render(<App />);
