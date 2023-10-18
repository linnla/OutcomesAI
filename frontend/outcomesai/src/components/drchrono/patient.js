import { getOne, postData } from '../../utils/API';
import { getMedications } from './medications';
import { getAppointments } from './appointments';

export async function savePatient(patient, practiceID) {
  try {
    console.log('Saving patient, practice_id:', patient, practiceID);

    patientObject = await patientObject(patient, practiceID);
    console.log('Patient Object:', patientObject);

    const response = await postData('practice_patients', patientObject);
    console.log('response.data:', response.data);

    // patient_id just created in postgres
    const patientID = response.data.id;

    if (!patient['date_of_first_appointment']) {
      console.error(
        `No first appointments date for Patient ${patientObject.ehr_id}`
      );
      return patientID;
    } else {
      //await getAppointments(
      //  patient.ehr_id,
      //  patientID,
      //  practiceID,
      //  patient['date_of_first_appointment']
      //);
      //await getMedications(patientObject.ehr_id, patientID, practiceID);
      return patientID;
    }
  } catch (error) {
    console.error(`Error saving patient ${patient.ehr_id}`);
    throw error;
  }
}

async function patientObject(patient, practiceID) {
  patient['practice_id'] = practiceID;

  try {
    if (patient['date_of_first_appointment']) {
      patient.date_first_appointment = patient['date_of_first_appointment'];
    }

    if (patient['date_of_birth']) {
      patient.birthdate = patient['date_of_birth'];
    }

    if (patient['gender']) {
      if ((patient['gender'] = 'Male')) {
        patient.gender_birth = 'M';
      } else if ((patient['gender'] = 'Female')) {
        patient.gender_birth = 'F';
      }
    }

    if (patient['race']) {
      //const inputString = "blank,white,other";
      const arrayOfWords = patient['race'].split(',');

      // Use the filter method to remove the 'blank' element
      const filteredArray = arrayOfWords.filter(
        (word) => word.trim() !== 'blank'
      );

      // Use the join method to join the remaining elements with a comma
      const resultString = filteredArray.join(',');
      patient['race'] = resultString;
    }

    if (patient['zip_code']) {
      patient.postal_code = patient['zip_code'];
      const zipInfo = await getOne('postal_codes', {
        postal_code: patient['zip_code'],
      });
      patient.city = zipInfo['city'];
      patient.county = zipInfo['county'];
      patient.state = zipInfo['state'];
      patient.state_code = zipInfo['state_code'];
      patient.country_code = zipInfo['country_code'];
    } else {
      if (patient['state']) {
        patient.state_code = patient['state'];
      }
    } // Added closing brace for the second if

    patient.ehr_id = patient['id'];
    delete patient.id;

    if (patient['cell_phone']) {
      patient.cell_phone = patient['cell_phone'].replace(/\D/g, '');
    }

    return patient;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
