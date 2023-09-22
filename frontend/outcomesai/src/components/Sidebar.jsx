import { useState } from 'react';
import { ProSidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined';
import LocalPharmacyOutlinedIcon from '@mui/icons-material/LocalPharmacyOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';
import MedicationLiquidOutlinedIcon from '@mui/icons-material/MedicationLiquidOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SickOutlinedIcon from '@mui/icons-material/SickOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import JoinInnerOutlinedIcon from '@mui/icons-material/JoinInnerOutlined';
import CastOutlinedIcon from '@mui/icons-material/CastOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';
import WifiTetheringOutlinedIcon from '@mui/icons-material/WifiTetheringOutlined';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SubMenuItem = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <SubMenu
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </SubMenu>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.primary[400]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#868dfb !important',
        },
        '& .pro-menu-item.active': {
          color: '#6870fa !important',
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape='square'>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: '10px 0 20px 0',
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                ml='15px'
              >
                <Typography variant='h3' color={colors.grey[100]}>
                  OutcomesAI
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          <Box paddingLeft={isCollapsed ? undefined : '5%'}>
            <Item
              title='Outcomes Dashboard'
              to='/dashboard/outcomes'
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title='Patients Dashboard'
              to='/dashboard/patients'
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant='h6'
              color={colors.grey[300]}
              sx={{ m: '15px 0 5px 20px' }}
            >
              Patient Data
            </Typography>
            {/*<Item
              title='Form'
              to='/Form'
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />*/}
            <Item
              title='Patient Search'
              to='/search/patients'
              icon={<PersonSearchOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/*<Item
              title='Patient Dashboard'
              to='/dashboard/patient'
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
          />*/}
            <Typography
              variant='h6'
              color={colors.grey[300]}
              sx={{ m: '15px 0 5px 20px' }}
            ></Typography>
            <SubMenu prefix='Manage Practice Data'>
              <Item
                title='Offices'
                to='/practice/offices'
                icon={<LocalHospitalOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Patients'
                to='/practice/patients'
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Practitioners'
                to='/practice/practitioners'
                icon={<Diversity3OutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='TMS Devices'
                to='/practice/tms_devices'
                icon={<CastOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='TMS Protocols'
                to='/practice/tms_protocols'
                icon={<BallotOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Users'
                to='/practice/users'
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <SubMenu prefix='Reference Data'>
              <Typography
                variant='h6'
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                Medications
              </Typography>
              <Item
                title='Active Ingredients'
                to='/reference_data/active_ingredients'
                icon={<LocalPharmacyOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Administration Methods'
                to='/reference_data/administration_methods'
                icon={<VaccinesOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Dosage Units'
                to='/reference_data/dosage_units'
                icon={<ScaleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Drug Delivery Forms'
                to='/reference_data/drug_delivery_forms'
                icon={<MedicationLiquidOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Medication Sources'
                to='/reference_data/medication_sources'
                icon={<MedicalServicesOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Medication Types'
                to='/reference_data/medication_types'
                icon={<MedicalInformationOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant='h6'
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                Diagnosis
              </Typography>
              <Item
                title='Diagnosis Codes'
                to='/reference_data/diagnosis_codes'
                icon={<MonitorHeartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Disorders'
                to='/reference_data/disorders'
                icon={<SickOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant='h6'
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                Procedures
              </Typography>
              <Item
                title='Procedure Catgeories'
                to='/reference_data/procedure_categories'
                icon={<CategoryOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Procedure Codes'
                to='/reference_data/procedure_codes'
                icon={<MedicationOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant='h6'
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                TMS
              </Typography>
              <Item
                title='Devices'
                to='/reference_data/tms_devices'
                icon={<CastOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Coils'
                to='/reference_data/tms_coils'
                icon={<JoinInnerOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Frequencies'
                to='/reference_data/tms_frequencies'
                icon={<SensorsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Pulse Types'
                to='/reference_data/tms_pulse_types'
                icon={<WifiTetheringOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Stimulation Sites'
                to='/reference_data/tms_stimulation_sites'
                icon={<PsychologyAltOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='TMS Protocols'
                to='/reference_data/tms_protocols'
                icon={<BallotOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant='h6'
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                Appointments
              </Typography>
              <Item
                title='Appointment Types'
                to='/reference_data/appointment_types'
                icon={<BloodtypeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant='h6'
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                Biomarkers
              </Typography>
              <Item
                title='Biomarker Types'
                to='/reference_data/biomarker_types'
                icon={<ScienceOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title='Biomarkers'
                to='/reference_data/biomarkers'
                icon={<BiotechOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Typography
                variant='h6'
                color={colors.grey[300]}
                sx={{ m: '15px 0 5px 20px' }}
              >
                Security
              </Typography>
              <Item
                title='User Roles'
                to='/reference_data/user_roles'
                icon={<LockOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
