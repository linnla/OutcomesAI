-- Table: public.cpt_codes

-- DROP TABLE IF EXISTS public.cpt_codes;

CREATE TABLE IF NOT EXISTS public.cpt_codes
(
    id integer NOT NULL DEFAULT nextval('cpt_codes_id_seq'::regclass),
    cpt_code character(5) COLLATE pg_catalog."default" NOT NULL,
    cpt_category_id integer NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT cpt_codes_pkey PRIMARY KEY (id),
    CONSTRAINT cpt_code UNIQUE (cpt_code),
    CONSTRAINT cpt_codes_category_id_fkey FOREIGN KEY (cpt_category_id)
        REFERENCES public.cpt_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT check_status CHECK (status::text = ANY (ARRAY['Active'::character varying::text, 'Inactive'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.cpt_codes
    OWNER to postgres;

-- Trigger: cpt_codes_created_at_trigger

-- DROP TRIGGER IF EXISTS cpt_codes_created_at_trigger ON public.cpt_codes;

CREATE OR REPLACE TRIGGER cpt_codes_created_at_trigger
    BEFORE INSERT
    ON public.cpt_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: cpt_codes_updated_at_trigger

-- DROP TRIGGER IF EXISTS cpt_codes_updated_at_trigger ON public.cpt_codes;

CREATE OR REPLACE TRIGGER cpt_codes_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.cpt_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();