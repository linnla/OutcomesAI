-- Table: public.patients

-- DROP TABLE IF EXISTS public.patients;

CREATE TABLE IF NOT EXISTS public.patients
(
    id integer NOT NULL DEFAULT nextval('patients_id_seq'::regclass),
    user_id integer,
    last_name character varying(85) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(85) COLLATE pg_catalog."default" NOT NULL,
    email citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    postal_code character varying(12) COLLATE pg_catalog."default",
    city character varying(85) COLLATE pg_catalog."default",
    county character varying(85) COLLATE pg_catalog."default",
    state character varying(85) COLLATE pg_catalog."default",
    state_code character(2) COLLATE pg_catalog."default",
    country_code character(2) COLLATE pg_catalog."default" NOT NULL,
    birthdate date NOT NULL,
    gender character(1) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT patients_pkey PRIMARY KEY (id),
    CONSTRAINT patients_email UNIQUE (email),
    CONSTRAINT patient_country_code FOREIGN KEY (country_code)
        REFERENCES public.countries (country_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT patient_postal_code FOREIGN KEY (postal_code)
        REFERENCES public.postal_codes (postal_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT check_gender CHECK (gender = ANY (ARRAY['F'::bpchar, 'M'::bpchar]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.patients
    OWNER to postgres;

-- Trigger: patients_created_at_trigger

-- DROP TRIGGER IF EXISTS patients_created_at_trigger ON public.patients;

CREATE OR REPLACE TRIGGER patients_created_at_trigger
    BEFORE INSERT
    ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: patients_updated_at_trigger

-- DROP TRIGGER IF EXISTS patients_updated_at_trigger ON public.patients;

CREATE OR REPLACE TRIGGER patients_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();