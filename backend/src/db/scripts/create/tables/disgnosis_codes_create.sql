-- Table: public.diagnosis_codes

-- DROP TABLE IF EXISTS public.diagnosis_codes;

CREATE TABLE IF NOT EXISTS public.diagnosis_codes
(
    id integer NOT NULL DEFAULT nextval('diagnosis_codes_id_seq'::regclass),
    classification_system character varying(12) COLLATE pg_catalog."default" NOT NULL,
    disorder_id integer NOT NULL,
    code character varying(35) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT diagnosis_codes_pkey PRIMARY KEY (id),
    CONSTRAINT diagnosis_codes_classification_system_code_key UNIQUE (classification_system, code),
    CONSTRAINT diagnosis_codes_disorder_id_fkey FOREIGN KEY (disorder_id)
        REFERENCES public.disorders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT check_status CHECK (status::text = ANY (ARRAY['Active'::character varying::text, 'Inactive'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.diagnosis_codes
    OWNER to postgres;

-- Trigger: diagnosis_codes_created_at_trigger

-- DROP TRIGGER IF EXISTS diagnosis_codes_created_at_trigger ON public.diagnosis_codes;

CREATE OR REPLACE TRIGGER diagnosis_codes_created_at_trigger
    BEFORE INSERT
    ON public.diagnosis_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: diagnosis_codes_updated_at_trigger

-- DROP TRIGGER IF EXISTS diagnosis_codes_updated_at_trigger ON public.diagnosis_codes;

CREATE OR REPLACE TRIGGER diagnosis_codes_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.diagnosis_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();