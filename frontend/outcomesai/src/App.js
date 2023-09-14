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
import OfficeManageGrid from './pages/offices';
import PractitionerManageGrid from './pages/practitioners/index';
import PatientManageGrid from './pages/patients/index';

// Reference Data
import ActiveIngredientsGrid from './pages/reference_data/active_ingredients';
import AcquisitionSourcesGrid from './pages/reference_data/acquisition_sources';
import AdministrationRoutesGrid from './pages/reference_data/administration_routes';
import DosageFormsGrid from './pages/reference_data/dosage_forms';
import DosageUnitsGrid from './pages/reference_data/dosage_units';
import MedicationTypesGrid from './pages/reference_data/medication_types';

import DiagnosisCodeGrid from './pages/reference_data/diagnosis_codes';
import DisordersGrid from './pages/reference_data/disorders';

import ProcedureCategoriesGrid from './pages/reference_data/procedure_categories';
import ProcedureCodesGrid from './pages/reference_data/procedure_codes';

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
              <DiagnosisCodeGrid />
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
          path='/offices'
          element={
            <RequireAuth>
              <OfficeManageGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/practitioners'
          element={
            <RequireAuth>
              <PractitionerManageGrid />
            </RequireAuth>
          }
        />
        <Route
          path='/patients'
          element={
            <RequireAuth>
              <PatientManageGrid />
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
