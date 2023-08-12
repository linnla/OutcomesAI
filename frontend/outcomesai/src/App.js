import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Invoices from './pages/Invoices';
import Offices from './pages/offices/Offices';
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

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          <Sidebar isSidebar={isSidebar} />
          <main className='content'>
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/login' element={<Login />} />
              <Route path='/offices' element={<Offices />} />
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
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
