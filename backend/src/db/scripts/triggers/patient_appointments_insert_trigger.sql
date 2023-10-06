-- FUNCTION: public.set_patient_appointment_ids()

-- DROP FUNCTION IF EXISTS public.set_patient_appointment_ids();

CREATE OR REPLACE FUNCTION public.set_patient_appointment_ids()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

DECLARE
  practitioner_id INT;
  billing_practitioner_id INT;
  supervising_practitioner_id INT;
  office_id INT;
  code_order INT;
  element RECORD;
  appt_year INT;
  appt_month INT;
  appt_day INT;
  appt_day_of_week INT;
  appt_quarter INT;
  
BEGIN
	IF NEW.ehr_practitioner_id IS NOT NULL THEN
    	UPDATE patient_appointments
		SET practitioner_id = practice_practitioners.practitioner_id
		FROM practice_practitioners
		WHERE NEW.ehr_practitioner_id = practice_practitioners.ehr_id
  		AND NEW.practice_id = practice_practitioners.practice_id
		AND NEW.id = patient_appointments.id;
	END IF;
		
	IF NEW.ehr_billing_practitioner_id IS NOT NULL THEN
    	UPDATE patient_appointments
		SET billing_practitioner_id = practice_practitioners.practitioner_id
		FROM practice_practitioners
		WHERE NEW.ehr_billing_practitioner_id = practice_practitioners.ehr_id
  		AND NEW.practice_id = practice_practitioners.practice_id
		AND NEW.id = patient_appointments.id;
	END IF;
		
	IF NEW.ehr_supervising_practitioner_id IS NOT NULL THEN
    	UPDATE patient_appointments
		SET supervising_practitioner_id = practice_practitioners.practitioner_id
		FROM practice_practitioners
		WHERE NEW.ehr_supervising_practitioner_id = practice_practitioners.ehr_id
  		AND NEW.practice_id = practice_practitioners.practice_id
		AND NEW.id = patient_appointments.id;
	END IF;
		
	IF NEW.ehr_office_id IS NOT NULL THEN
    	UPDATE patient_appointments
		SET office_id = offices.id
		FROM offices
		WHERE NEW.ehr_office_id = offices.ehr_id
  		AND NEW.practice_id = offices.practice_id;
	END IF;
	
	SELECT EXTRACT(YEAR FROM NEW.scheduled_time) INTO appt_year;
	SELECT EXTRACT(MONTH FROM NEW.scheduled_time) INTO appt_month;
	SELECT EXTRACT(DAY FROM NEW.scheduled_time) INTO appt_day;
	SELECT EXTRACT(DOW FROM NEW.scheduled_time) INTO appt_day_of_week;
	SELECT EXTRACT(QUARTER FROM NEW.scheduled_time) INTO appt_quarter;

	IF NEW.icd10_code IS NOT NULL THEN
    	code_order := 0;
    	FOR element IN SELECT unnest(NEW.icd10_code) AS array_element
    	LOOP
        	INSERT INTO public.patient_diagnosis(
            	practice_id, patient_id, practitioner_id, office_id, patient_appointment_id, diagnosis_code_id, code_order, year, month, day, day_of_week, quarter)
        	VALUES (NEW.practice_id, NEW.patient_id, practitioner_id, office_id, NEW.id, 
            	(SELECT id FROM diagnosis_codes WHERE element = diagnosis_codes.code), -- Retrieve id based on element
            	code_order, appt_year, appt_month, appt_day, appt_day_of_week, appt_quarter);
        	code_order := code_order + 1;
    	END LOOP;
	END IF;

RETURN NEW;
END;
$BODY$;
					
-- Create an AFTER INSERT OR UPDATE trigger that calls the patient_appointment function
CREATE TRIGGER set_patient_appointment_ids_trigger
AFTER INSERT OR UPDATE ON patient_appointments
FOR EACH ROW
EXECUTE FUNCTION set_patient_appointment_ids();

-- ALTER FUNCTION public.patient_appointment()
--     OWNER TO postgres;
