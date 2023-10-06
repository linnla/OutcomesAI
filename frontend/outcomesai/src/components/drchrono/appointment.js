import { getDrchronoData } from '../../utils/API';

export async function Appointment(appointment_id = '') {
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

export async function AppointmentObject(medication) {
  let medicationObject = medication;

  try {
    const datePrescribed = medication.date_prescribed
      ? formatDate(medication.date_prescribed)
      : null;
    medicationObject['date_prescribed'] = datePrescribed;

    const dateStarted = medication.date_started_taking
      ? formatDate(medication.date_started_taking)
      : null;
    medicationObject['date_started_taking'] = dateStarted;

    const dateStopped = medication.date_stopped_taking
      ? formatDate(medication.date_stopped_taking)
      : null;
    medicationObject['date_stopped_taking'] = dateStopped;

    // Convert string to an integer
    let dispenseQuantity = 0;
    if (medication.dispense_quantity !== null) {
      dispenseQuantity = parseInt(medication.dispense_quantity, 10);
    }
    medicationObject['dispense_quantity'] = dispenseQuantity;

    let dosageQuantity = 0;
    if (medication.dosage_quantity !== null) {
      dosageQuantity = parseInt(medication.dosage_quantity, 10);
    }
    medicationObject['dosage_quantity'] = dosageQuantity;

    return medicationObject;
  } catch (error) {
    console.error(error);
  }
}
