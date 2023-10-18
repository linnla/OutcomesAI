CREATE OR REPLACE FUNCTION public.set_patient_appointment_ids()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

DECLARE
  practitioner INT;
  billing_practitioner INT;
  supervising_practitioner INT;
  office INT;
  code_order INT;
  element RECORD;
  
BEGIN
 
	SELECT practice_practitioners.practitioner_id INTO practitioner
    FROM practice_practitioners
    WHERE practice_practitioners.ehr_id = NEW.ehr_practitioner_id and NEW.practice_id = practice_practitioners.practice_id;
		
    IF practitioner IS NOT NULL THEN
        UPDATE patient_appointments
        SET practitioner_id = practitioner
        WHERE NEW.id = patient_appointments.id;
    END IF;
	
	SELECT practice_practitioners.practitioner_id INTO billing_practitioner
        FROM practice_practitioners
        WHERE practice_practitioners.ehr_id = NEW.ehr_billing_practitioner_id and NEW.practice_id = practice_practitioners.practice_id;
		
    IF billing_practitioner IS NOT NULL THEN
        UPDATE patient_appointments
        SET billing_practitioner_id = billing_practitioner
        WHERE NEW.id = patient_appointments.id;
    END IF;
	
	SELECT practice_practitioners.practitioner_id INTO supervising_practitioner
        FROM practice_practitioners
        WHERE practice_practitioners.ehr_id = NEW.ehr_supervising_practitioner_id and NEW.practice_id = practice_practitioners.practice_id;
		
    IF supervising_practitioner IS NOT NULL THEN
        UPDATE patient_appointments
        SET supervising_practitioner_id = supervising_practitioner
        WHERE NEW.id = patient_appointments.id;
    END IF;
	
	SELECT offices.id INTO office
        FROM offices
        WHERE NEW.ehr_office_id = offices.id and offices.practice_id = NEW.practice.id;
		
    IF office IS NOT NULL THEN
        UPDATE patient_appointments
        SET office_id = office
        WHERE NEW.id = patient_appointments.id;
    END IF;

	-- Conditionally insert icd10_code
    IF NEW.icd10_code IS NOT NULL THEN
        code_order := 0;
        FOR element IN SELECT unnest(NEW.icd10_code) AS array_element
        LOOP
            -- Define office_id conditionally
            IF NEW.ehr_office_id IS NOT NULL THEN
                IF office IS NOT NULL THEN
                    INSERT INTO public.patient_diagnosis(
                        practice_id, patient_id, practitioner_id, office_id, patient_appointment_id, diagnosis_code_id, code_order, "year", "month", "day", day_of_week, quarter)
                    VALUES (NEW.practice_id, NEW.patient_id, practitioner, office, NEW.id, 
                        (SELECT id FROM diagnosis_codes WHERE element = diagnosis_codes.code), -- Retrieve id based on element
                        code_order, NEW.year, NEW.month, NEW.day, NEW.day_of_week, NEW.quarter);
                END IF;
            ELSE
                -- Office_id is NULL, insert without office_id
                INSERT INTO public.patient_diagnosis(
                    practice_id, patient_id, practitioner_id, patient_appointment_id, diagnosis_code_id, code_order, "year", "month", "day", day_of_week, quarter)
                VALUES (NEW.practice_id, NEW.patient_id, practitioner, NEW.id, 
                    (SELECT id FROM diagnosis_codes WHERE element = diagnosis_codes.code), -- Retrieve id based on element
                    code_order, NEW.year, NEW.month, NEW.day, NEW.day_of_week, NEW.quarter);
            END IF;
            code_order := code_order + 1;
        END LOOP;
    END IF;
	
RETURN NEW;
END;
$BODY$;

-- Create an AFTER INSERT trigger that calls the set_patient_medication_practitioner_id function
CREATE TRIGGER set_patient_appointment_ids_trigger
AFTER INSERT OR UPDATE ON patient_appointments
FOR EACH ROW
EXECUTE FUNCTION set_patient_appointment_ids();