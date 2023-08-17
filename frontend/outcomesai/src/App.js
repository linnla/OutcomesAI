import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Invoices from './pages/Invoices';
import OfficeManagerGrid from './pages/offices';
import Practitioners from './pages/Practitioners';
import Patients from './pages/Patients';
import Bar from './pages/Bar';
import Form from './pages/Form';
import Line from './pages/Line';
import Pie from './pages/Pie';
import FAQ from './pages/Faq';
import Geography from './pages/Geography';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import Calendar from './pages/Calendar';
import { getUserData } from './utils/AuthService';
import { RequireAuth } from './utils/RequireAuth';
import { Authenticator } from '@aws-amplify/ui-react';

//const AuthContext = React.createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  //const [userData, setUserData] = useState('admin');

  //const getUserData = async () => {
  //  const user = await getUserData();
  //  console.log('user:', user);
  //  setUserData(user);
  //};
  const userData = {
    role: 'manager',
  };

  console.log('App userData:', userData);

  function MyRoutes() {
    return (
      <Routes>
        <Route index element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path='home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {
          (userData.role = 'admin' && (
            <Route
              path='/offices'
              element={
                <RequireAuth>
                  <OfficeManagerGrid />
                </RequireAuth>
              }
            />
          ))
        }
        <Route path='/practitioners' element={<Practitioners />} />
        <Route path='/team' element={<Team />} />
        <Route path='/patients' element={<Patients />} />
        <Route path='/invoices' element={<Invoices />} />
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
      <Authenticator.Provider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className='app'>
            <Sidebar isSidebar={isSidebar} />
            <main className='content'>
              <Topbar setIsSidebar={setIsSidebar} />
              <MyRoutes />
            </main>
          </div>
        </ThemeProvider>
      </Authenticator.Provider>
    </ColorModeContext.Provider>
  );
}

export default App;
