import { getDrchronoData, getOne, postData } from '../../utils/API';

export async function MedicationsGet(patient_id) {
  const body = {
    api: 'Medications',
    fields: {
      patient: patient_id,
    },
  };

  try {
    const response = await getDrchronoData('drchrono', body);
    return response;
  } catch (error) {
    console.error(error);
  }
}

function formatDate(dateString) {
  // Assuming medication.date_prescribed is in a valid date format
  const datePrescribed = new Date(dateString);

  // Get the components of the date
  const year = datePrescribed.getFullYear();
  const month = datePrescribed.getMonth(); // Months are zero-based
  const day = datePrescribed.getDate();

  // Create a new Date object with the components
  const formattedDate = new Date(year, month, day);
  return formattedDate;

  console.log(formattedDate); // Output: A Date object representing the date
}

export async function MedicationsPost(medication) {
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

    // Convert string to a boolean (assuming "prn" and "daw" are boolean fields)
    //const prn = medication.prn !== null ? medication.prn.toLowerCase() === 'true' : false;
    //const daw = medication.daw !== null ? medication.daw.toLowerCase() === 'true' : false;

    return medicationObject;
  } catch (error) {
    console.error(error);
  }
}
