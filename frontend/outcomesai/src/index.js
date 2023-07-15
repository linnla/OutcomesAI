import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App';
import { config } from './config';
import { awsConfig } from './config';
import { queryTable } from './api';
import { createRecord } from './api';
import { updateRecord } from './api';
import { deleteRecord } from './api';

Amplify.configure(awsConfig);

const patient = {
  last_name: 'Brewer',
  first_name: 'Virginia',
  email: 'vb@aol.com',
  postal_code: 90266,
  city: 'Manhattan Beach',
  state: 'California',
  state_code: 'CA',
  county: 'Los Angeles',
  country_code: 'US',
  gender: 'F',
  birthdate: '07/08/1932',
};

//queryTable('users', { email: 'tess.koo@yahoo.com' });
//queryTable('practice_users', { practice_id: 100101 });
//queryTable('practice_patients', { practice_id: 100101 });
//queryTable('offices', { practice_id: 100101 });

//createRecord('patients', patient);

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

root.render(<App />);
