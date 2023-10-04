import { getDrchronoData } from '../../utils/API';

async function Appointments(fields) {
  let body = {
    api: 'Appointments',
    fields: fields,
  };

  try {
    const response = await getDrchronoData('drchrono', body);
    //console.log('drchrono appointments response:', response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export default Appointments;
