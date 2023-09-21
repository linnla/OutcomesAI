import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

// Components and pages
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Invoices from './pages/Invoices';

// Master Data
import PatientsGrid from './pages/master_data/patients/index';
import OfficesGrid from './pages/master_data/offices';
import PractitionersGrid from './pages/master_data/practitioners/index';
import PracticeTMSDevicesGrid from './pages/master_data/practice_tms_devices';
import PracticeTMSProtocolsGrid from './pages/master_data/practice_tms_protocols';
import UsersGrid from './pages/master_data/users';

// Reference Data
import ActiveIngredientsGrid from './pages/reference_data/active_ingredients';
import AcquisitionSourcesGrid from './pages/reference_data/acquisition_sources';
import AdministrationRoutesGrid from './pages/reference_data/administration_routes';
import DosageFormsGrid from './pages/reference_data/dosage_forms';
import DosageUnitsGrid from './pages/reference_data/dosage_units';
import MedicationTypesGrid from './pages/reference_data/medication_types';

import DiagnosisCodesGrid from './pages/reference_data/diagnosis_codes';
import DisordersGrid from './pages/reference_data/disorders';

import ProcedureCategoriesGrid from './pages/reference_data/procedure_categories';
import ProcedureCodesGrid from './pages/reference_data/procedure_codes';
import AppointmentTypesGrid from './pages/reference_data/appointment_types';

import TMSDevicesGrid from './pages/reference_data/tms_devices';
import TMSCoilsGrid from './pages/reference_data/tms_coils';
import TMSFrequenciesGrid from './pages/reference_data/tms_frequencies';
import TMSPulseTypesGrid from './pages/reference_data/tms_pulse_types';
import TMSStimlationSitesGrid from './pages/reference_data/tms_stimulation_sites';
import TMSProtocolGrid from './pages/reference_data/tms_protocols';

import RolesGrid from './pages/reference_data/roles';
import BiomarkerTypesGrid from './pages/reference_data/biomarker_types';
import BiomarkersGrid from './pages/reference_data/biomarkers';

import Bar from './pages/Bar';
import Form from './pages/Form';
import Line from './pages/Line';
import Pie from './pages/Pie';
import FAQ from './pages/Faq';
import Geography from './pages/Geography';
import Calendar from './pages/Calendar';

// Utils and Contexts
import { ColorModeContext, useMode } from './theme';
import { RequireAuth } from './utils/RequireAuth';
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { OfficeProvider } from './contexts/OfficeContext';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await Auth.currentSession();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('User not authenticated:', error);
        setIsAuthenticated(false);
      }
    }

    checkAuthentication();
  }, [loginSuccess]);

  function handleSuccessfulLogin() {
    setLoginSuccess((prev) => !prev); // Toggle the state
  }

  function AppRoutes() {
    return (
      <Routes>
        <Route index element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path='home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route
          path='/practice/offices'
          element={
            <RequireAuth>
              <OfficesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/practice/practitioners'
          element={
            <RequireAuth>
              <PractitionersGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/practice/patients'
          element={
            <RequireAuth>
              <PatientsGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/practice/users'
          element={
            <RequireAuth>
              <UsersGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/practice/tms_devices'
          element={
            <RequireAuth>
              <PracticeTMSDevicesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/practice/tms_protocols'
          element={
            <RequireAuth>
              <PracticeTMSProtocolsGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/tms_protocols'
          element={
            <RequireAuth>
              <TMSProtocolGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/active_ingredients'
          element={
            <RequireAuth>
              <ActiveIngredientsGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/medication_sources'
          element={
            <RequireAuth>
              <AcquisitionSourcesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/administration_methods'
          element={
            <RequireAuth>
              <AdministrationRoutesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/drug_delivery_forms'
          element={
            <RequireAuth>
              <DosageFormsGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/dosage_units'
          element={
            <RequireAuth>
              <DosageUnitsGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/medication_types'
          element={
            <RequireAuth>
              <MedicationTypesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/diagnosis_codes'
          element={
            <RequireAuth>
              <DiagnosisCodesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/disorders'
          element={
            <RequireAuth>
              <DisordersGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/procedure_categories'
          element={
            <RequireAuth>
              <ProcedureCategoriesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/procedure_codes'
          element={
            <RequireAuth>
              <ProcedureCodesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/appointment_types'
          element={
            <RequireAuth>
              <AppointmentTypesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/tms_devices'
          element={
            <RequireAuth>
              <TMSDevicesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/tms_coils'
          element={
            <RequireAuth>
              <TMSCoilsGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/tms_frequencies'
          element={
            <RequireAuth>
              <TMSFrequenciesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/tms_pulse_types'
          element={
            <RequireAuth>
              <TMSPulseTypesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/tms_stimulation_sites'
          element={
            <RequireAuth>
              <TMSStimlationSitesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/biomarker_types'
          element={
            <RequireAuth>
              <BiomarkerTypesGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/biomarkers'
          element={
            <RequireAuth>
              <BiomarkersGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/reference_data/user_roles'
          element={
            <RequireAuth>
              <RolesGrid />
            </RequireAuth>
          }
        />
        <Route path='/form' element={<Form />} />
        <Route path='/bar' element={<Bar />} />
        <Route path='/pie' element={<Pie />} />
        <Route path='/line' element={<Line />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/geography' element={<Geography />} />
      </Routes>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Authenticator.Provider>
          <CssBaseline />
          <div className='app'>
            <Sidebar isSidebar={isSidebar} />
            <main className='content'>
              <Topbar setIsSidebar={setIsSidebar} />
              {isAuthenticated ? (
                <AppRoutes />
              ) : (
                <Login onSuccessfulLogin={handleSuccessfulLogin} />
              )}
            </main>
          </div>
        </Authenticator.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
