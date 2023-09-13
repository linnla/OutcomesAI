-- Table: public.patient_biomarkers

-- DROP TABLE IF EXISTS public.patient_biomarkers;

CREATE TABLE IF NOT EXISTS public.patient_biomarkers
(
    patient_id integer NOT NULL,
    biomarker_id integer NOT NULL,
    value citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT patient_biomarkers_pkey PRIMARY KEY (patient_id, biomarker_id, value),
    CONSTRAINT patient_biomarkers_value UNIQUE (value),
    CONSTRAINT patient_biomakers_biomarker_id FOREIGN KEY (biomarker_id)
        REFERENCES public.biomarkers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT patient_biomarkers_patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.patient_biomarkers
    OWNER to postgres;

-- Trigger: patient_biomarkers_updated_at_trigger

-- DROP TRIGGER IF EXISTS patient_biomarkers_updated_at_trigger ON public.patient_biomarkers;

CREATE OR REPLACE TRIGGER patient_biomarkers_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.patient_biomarkers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Trigger: patients_biomarkers_created_at_trigger

-- DROP TRIGGER IF EXISTS patients_biomarkers_created_at_trigger ON public.patient_biomarkers;

CREATE OR REPLACE TRIGGER patients_biomarkers_created_at_trigger
    BEFORE INSERT
    ON public.patient_biomarkers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();