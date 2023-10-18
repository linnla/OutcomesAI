import {
  dateStringToDate,
  getYear,
  getMonth,
  getDayNumber,
  getHours,
  getMinutes,
  getDayOfWeek,
  getQuarter,
  getYesterday,
} from '../../utils/DateUtils';
import { getDrchronoData, postData, getData } from '../../utils/API';

export async function getAppointments(
  ehrPatientID,
  patientID,
  practiceID,
  dateFirstAppointment
) {
  const yesterday = getYesterday();
  const dateRange = `${dateFirstAppointment}/${yesterday}`;
  const fields = { patient: ehrPatientID, date_range: dateRange };

  const bodyAppt = {
    api: 'Appointments',
    fields: fields,
  };
  const appointments = await getDrchronoData('drchrono', bodyAppt);
  //console.log('drchrono appointment response:', appointments);

  if (appointments.length > 0) {
    await saveAppointments(appointments, patientID, practiceID);
  } else {
    console.error(`No appointments found for Patient ${ehrPatientID}`);
  }
}

async function saveAppointments(appointments, patientID, practiceID) {
  let offices = [];
  offices = await getData('offices', { practice_id: practiceID });

  let practitioners = [];
  practitioners = await getData('practice_practitioners', {
    practice_id: practiceID,
  });

  let appointmentsSaved = 0;
  const appointmentsFound = appointments.length;
  try {
    for (const appointment of appointments) {
      let appointmentObject = await AppointmentObject(
        appointment,
        patientID,
        practiceID,
        offices,
        practitioners
      );
      //console.log('appointment:', appointment);
      //console.log('appointmentObject:', appointmentObject);

      await postData('patient_appointments', appointmentObject);
      appointmentsSaved += 1;
      //console.log('Saved:', appointmentsSaved, appointmentObject);
    }
    console.log(
      `${appointmentsFound} appointment found, ${appointmentsSaved} appointments saved`
    );
  } catch (error) {
    console.error(error);
    console.error(
      `${appointmentsFound} appointment found, ${appointmentsSaved} appointments saved`
    );
    throw error;
  }
}

function AppointmentObject(
  appointment,
  patientID,
  practiceID,
  offices,
  practitioners
) {
  let object = appointment;

  object['practice_id'] = practiceID;
  object['practice_patient_id'] = patientID;
  object['ehr_patient_id'] = appointment.patient;
  object['ehr_id'] = appointment.id;
  delete object.id;

  try {
    // Get office ID
    if (appointment['office']) {
      const officeObj = offices.find(
        (obj) => obj.ehr_id === appointment.office
      );
      if (officeObj) {
        object['office_id'] = officeObj.id;
      }
      object['ehr_office_id'] = appointment.office;
    }

    // Get practitioner ID
    if (appointment['doctor']) {
      const practitionerObj = practitioners.find(
        (obj) => obj.ehr_id === appointment.doctor
      );
      if (practitionerObj) {
        object['practitioner_id'] = practitionerObj.id;
      }
      object['ehr_practitioner_id'] = appointment.doctor;
    }

    // Get supervising practitioner ID
    if (appointment['supervising_provider']) {
      const supervisingObj = practitioners.find(
        (obj) => obj.ehr_id === appointment.supervising_provider
      );
      if (supervisingObj) {
        object['supervising_practitioner_id'] = supervisingObj.id;
      }
      object['ehr_supervising_practitioner_id'] =
        appointment.supervising_provider;
    }

    // Get billing practitioner ID
    if (appointment['billing_provider']) {
      const billingObj = practitioners.find(
        (obj) => obj.ehr_id === appointment.billing_provider
      );
      if (billingObj) {
        object['billing_practitioner_id'] = billingObj.id;
      }
      object['ehr_billing_practitioner_id'] = appointment.billing_provider;
    }

    if (appointment['created_at']) {
      const create_date = appointment.created_at
        ? dateStringToDate(appointment.created_at)
        : null;
      object['create_date'] = create_date;
    }

    if (appointment['updated_at']) {
      const update_date = appointment.updated_at
        ? dateStringToDate(appointment.updated_at)
        : null;
      object['update_date'] = update_date;
    }

    if (appointment['last_billed_date']) {
      const last_billed = appointment.last_billed_date
        ? dateStringToDate(appointment.last_billed_date)
        : null;
      object['last_billed_date'] = last_billed;
    }

    if (appointment['scheduled_time']) {
      const scheduled = appointment.scheduled_time
        ? dateStringToDate(appointment.scheduled_time)
        : null;
      object['scheduled_time'] = scheduled;
      object['year'] = getYear(appointment.scheduled_time);
      object['month'] = getMonth(appointment.scheduled_time);
      object['day'] = getDayNumber(appointment.scheduled_time);
      object['hour'] = getHours(appointment.scheduled_time);
      object['minute'] = getMinutes(appointment.scheduled_time);
      object['day_of_week'] = getDayOfWeek(appointment.scheduled_time);
      object['quarter'] = getQuarter(appointment.scheduled_time);
    }

    return object;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
