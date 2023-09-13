-- Table: public.practice_patients

-- DROP TABLE IF EXISTS public.practice_patients;

CREATE TABLE IF NOT EXISTS public.practice_patients
(
    practice_id integer NOT NULL,
    patient_id integer NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Active'::bpchar,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT practice_patients_pkey PRIMARY KEY (practice_id, patient_id),
    CONSTRAINT practice_patients_patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT practice_patinets_practice_id FOREIGN KEY (practice_id)
        REFERENCES public.practices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT check_status CHECK (status::bpchar = ANY (ARRAY['Active'::bpchar, 'Inactive'::bpchar]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.practice_patients
    OWNER to postgres;

-- Trigger: practice_patients_created_at_trigger

-- DROP TRIGGER IF EXISTS practice_patients_created_at_trigger ON public.practice_patients;

CREATE OR REPLACE TRIGGER practice_patients_created_at_trigger
    BEFORE INSERT
    ON public.practice_patients
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: practice_patients_updated_at_trigger

-- DROP TRIGGER IF EXISTS practice_patients_updated_at_trigger ON public.practice_patients;

CREATE OR REPLACE TRIGGER practice_patients_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.practice_patients
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();