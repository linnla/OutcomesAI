import {
  dateStringToDate,
  getYear,
  getMonth,
  getDayNumber,
  getDayOfWeek,
  getQuarter,
} from '../../utils/DateUtils';
import { getDrchronoData, postData, getData } from '../../utils/API';

export async function getMedications(ehrPatientID, patientID, practiceID) {
  const fields = { patient: ehrPatientID };

  const bodyAppt = {
    api: 'Medications',
    fields: fields,
  };
  const medications = await getDrchronoData('drchrono', bodyAppt);
  console.log('drchrono medication response:', medications);

  if (medications.length > 0) {
    await saveMedications(medications, ehrPatientID, patientID, practiceID);
  } else {
    console.error(`No medications found for Patient ${ehrPatientID}`);
  }
}

async function saveMedications(
  medications,
  ehrPatientID,
  patientID,
  practiceID
) {
  let medicationsSaved = 0;
  const medicationsFound = medications.length;

  // This is not a fatal error if data is not found so continue processing
  let patient_appointments = [];
  try {
    patient_appointments = await getData('patient_appointments', {
      practice_id: practiceID,
      practice_patient_id: patientID,
    });
  } catch (error) {
    console.error(error);
  }

  // This is not a fatal error if data is not found so continue processing
  let practitioners = [];
  try {
    practitioners = await getData('practice_practitioners', {
      practice_id: practiceID,
    });
  } catch (error) {
    console.error(error);
  }

  try {
    for (const medication of medications) {
      let medicationObject = await MedicationObject(
        medication,
        ehrPatientID,
        patientID,
        practiceID,
        patient_appointments,
        practitioners
      );
      await postData('patient_medications', medicationObject);
      medicationsSaved += 1;
      console.log('Saved:', medicationsSaved, medicationObject);
    }
    console.log(
      `${medicationsSaved} medications saved for Patient ${ehrPatientID}`
    );
  } catch (error) {
    console.error(error);
    console.error(
      `${medicationsFound} medications found, ${medicationsSaved} medications saved`
    );
    throw error;
  }
}

function MedicationObject(
  medication,
  ehrPatientID,
  patientID,
  practiceID,
  patient_appointments,
  practitioners
) {
  let object = medication;

  object['practice_patient_id'] = patientID;
  object['ehr_patient_id'] = ehrPatientID;
  object['practice_id'] = practiceID;
  object['ehr_id = medication'] = medication.id;
  delete object.id;

  try {
    // Get practitioner ID
    if (medication['doctor']) {
      const practitionerObj = practitioners.find(
        (obj) => obj.ehr_id === medication.doctor
      );
      if (practitionerObj) {
        object.practitioner_id = practitionerObj.id;
      }
      object['ehr_practitioner_id'] = medication.doctor;
    }

    // Get appointment ID
    if (medication['appointment']) {
      const appointmentObj = patient_appointments.find(
        (obj) => obj.ehr_id === medication.appointment
      );
      if (appointmentObj) {
        object.appointment_id = appointmentObj.id;
      }
      object['ehr_appointment_id'] = medication.appointment;
    }

    if (medication['date_started_taking']) {
      const dateStarted = medication.date_started_taking
        ? dateStringToDate(medication.date_started_taking)
        : null;
      object['date_started_taking'] = dateStarted;
    }

    if (medication['date_stopped_taking']) {
      const dateStopped = medication.date_stopped_taking
        ? dateStringToDate(medication.date_stopped_taking)
        : null;
      object['date_stopped_taking'] = dateStopped;
    }

    const datePrescribed = medication.date_prescribed
      ? dateStringToDate(medication.date_prescribed)
      : null;
    object['date_prescribed'] = datePrescribed;

    if (medication['date_prescribed']) {
      object['year'] = getYear(medication.date_prescribed);
      object['month'] = getMonth(medication.date_prescribed);
      object['date'] = getDayNumber(medication.date_prescribed);
      object['day_of_week'] = getDayOfWeek(medication.date_prescribed);
      object['quarter'] = getQuarter(medication.date_prescribed);
    }

    // Convert string to an integer
    let dispenseQuantity = 0;
    if (medication.dispense_quantity !== null) {
      dispenseQuantity = parseInt(medication.dispense_quantity, 10);
    }
    object['dispense_quantity'] = dispenseQuantity;

    let dosageQuantity = 0;
    if (medication.dosage_quantity !== null) {
      dosageQuantity = parseInt(medication.dosage_quantity, 10);
    }
    object['dosage_quantity'] = dosageQuantity;

    return object;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
