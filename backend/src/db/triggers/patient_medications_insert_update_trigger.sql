CREATE OR REPLACE FUNCTION public.set_patient_medication_practitioner_id()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

DECLARE
  practitioner INT;

BEGIN
	SELECT practice_practitioners.practitioner_id INTO practitioner
        FROM practice_practitioners
        WHERE practice_practitioners.ehr_id = NEW.ehr_practitioner_id and NEW.practice_id = practice_practitioners.practice_id;
		
    IF practitioner IS NOT NULL THEN
        UPDATE patient_appointments
        SET practitioner_id = practitioner
        WHERE NEW.id = patient_appointments.id;
    END IF;
	
RETURN NEW;
END;
$BODY$;

-- Create an AFTER INSERT trigger that calls the set_patient_medication_practitioner_id function
CREATE TRIGGER set_patient_medication_practitioner_id_trigger
AFTER INSERT OR UPDATE ON patient_medications
FOR EACH ROW
EXECUTE FUNCTION set_patient_medication_practitioner_id();

