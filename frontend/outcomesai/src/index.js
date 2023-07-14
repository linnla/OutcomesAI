import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import { searchTable } from './api';
import { config } from './config';
import { awsConfig } from './config';

Amplify.configure(awsConfig);

searchTable('users', { email: 'tess.koo@yahoo.com' });
searchTable('practice_users', { practice_id: 100101 });
searchTable('practice_patients', { practice_id: 100101 });
searchTable('offices', { practice_id: 100101 });

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

root.render(<App />);
