-- Table: public.episodes_of_care

-- DROP TABLE IF EXISTS public.episodes_of_care;

CREATE TABLE IF NOT EXISTS public.episodes_of_care
(
    id integer NOT NULL DEFAULT nextval('episodes_of_care_id_seq'::regclass),
    practitioner_id integer NOT NULL,
    patient_id integer NOT NULL,
    office_id integer NOT NULL,
    practice_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date,
    care_status character varying(25) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT episodes_of_care_pkey PRIMARY KEY (id),
    CONSTRAINT "practice-patient-start-date" UNIQUE (patient_id, practice_id, start_date),
    CONSTRAINT episodes_of_care_practitioner_id_fkey FOREIGN KEY (practitioner_id)
        REFERENCES public.practitioners (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT office_id FOREIGN KEY (office_id)
        REFERENCES public.offices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT patient_id FOREIGN KEY (patient_id)
        REFERENCES public.patients (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT practice_id FOREIGN KEY (practice_id)
        REFERENCES public.practices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.episodes_of_care
    OWNER to postgres;

-- Trigger: episodes_of_care_created_at_trigger

-- DROP TRIGGER IF EXISTS episodes_of_care_created_at_trigger ON public.episodes_of_care;

CREATE OR REPLACE TRIGGER episodes_of_care_created_at_trigger
    BEFORE INSERT
    ON public.episodes_of_care
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: episodes_of_care_updated_at_trigger

-- DROP TRIGGER IF EXISTS episodes_of_care_updated_at_trigger ON public.episodes_of_care;

CREATE OR REPLACE TRIGGER episodes_of_care_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.episodes_of_care
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();