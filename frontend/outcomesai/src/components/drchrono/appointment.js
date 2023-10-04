import { getDrchronoData } from '../../utils/API';

async function Appointment(appointment_id = '') {
  const apiUrl = `https://app.drchrono.com/api/appointments/${appointment_id}`;

  let body = {};
  if (appointment_id !== '') {
    body = {
      api: 'Appointments',
      url: apiUrl,
    };
  } else {
    console.error('Appointment url is None');
    return;
  }

  try {
    const response = await getDrchronoData('drchrono', body);
    console.log('drchrono appointments response:', response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export default Appointment;
