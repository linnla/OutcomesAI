CREATE OR REPLACE FUNCTION set_patient_medication_practitioner_id()
RETURNS TRIGGER AS $$
DECLARE
  practitioner_id INT;
BEGIN
	IF NEW.ehr_practitioner_id IS NOT NULL THEN
    	UPDATE patient_medications
		SET practitioner_id = practice_practitioners.practitioner_id
		FROM practice_practitioners
		WHERE NEW.ehr_practitioner_id = practice_practitioners.ehr_id
  		AND NEW.practice_id = practice_practitioners.practice_id
		AND NEW.id = patient_medications.id;

	END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create an AFTER INSERT trigger that calls the set_patient_medication_practitioner_id function
CREATE TRIGGER set_patient_medication_practitioner_id_trigger
AFTER INSERT OR UPDATE ON patient_medications
FOR EACH ROW
EXECUTE FUNCTION set_patient_medication_practitioner_id();

