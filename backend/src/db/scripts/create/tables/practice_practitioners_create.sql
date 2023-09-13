-- Table: public.practice_practitioners

-- DROP TABLE IF EXISTS public.practice_practitioners;

CREATE TABLE IF NOT EXISTS public.practice_practitioners
(
    practitioner_id integer NOT NULL,
    practice_id integer NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Active'::bpchar,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT practice_practitioners_pkey PRIMARY KEY (practice_id, practitioner_id),
    CONSTRAINT practice_practitioners_practice_id FOREIGN KEY (practice_id)
        REFERENCES public.practices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT practice_practitioners_practitioner_id FOREIGN KEY (practitioner_id)
        REFERENCES public.practitioners (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT check_status CHECK (status::bpchar = ANY (ARRAY['Active'::bpchar, 'Inactive'::bpchar]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.practice_practitioners
    OWNER to postgres;

-- Trigger: practice_practitioners_created_at_trigger

-- DROP TRIGGER IF EXISTS practice_practitioners_created_at_trigger ON public.practice_practitioners;

CREATE OR REPLACE TRIGGER practice_practitioners_created_at_trigger
    BEFORE INSERT
    ON public.practice_practitioners
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: practice_practitioners_updated_at_trigger

-- DROP TRIGGER IF EXISTS practice_practitioners_updated_at_trigger ON public.practice_practitioners;

CREATE OR REPLACE TRIGGER practice_practitioners_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.practice_practitioners
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();