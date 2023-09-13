-- Table: public.offices

-- DROP TABLE IF EXISTS public.offices;

CREATE TABLE IF NOT EXISTS public.offices
(
    id integer NOT NULL DEFAULT nextval('offices_id_seq'::regclass),
    practice_id integer NOT NULL,
    name citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    virtual boolean NOT NULL,
    postal_code character varying(12) COLLATE pg_catalog."default",
    city character varying(85) COLLATE pg_catalog."default",
    state character varying(85) COLLATE pg_catalog."default",
    county character varying(85) COLLATE pg_catalog."default",
    state_code character(2) COLLATE pg_catalog."default",
    country_code character(2) COLLATE pg_catalog."default" NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Active'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT offices_pkey PRIMARY KEY (id),
    CONSTRAINT offices_name UNIQUE (name),
    CONSTRAINT offices_practice_id_name UNIQUE (practice_id, name),
    CONSTRAINT offices_country_code FOREIGN KEY (country_code)
        REFERENCES public.countries (country_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT offices_postal_code FOREIGN KEY (postal_code)
        REFERENCES public.postal_codes (postal_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT offices_practice_id FOREIGN KEY (practice_id)
        REFERENCES public.practices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT check_status CHECK (status::text = ANY (ARRAY['Active'::character varying::text, 'Inactive'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.offices
    OWNER to postgres;

-- Trigger: offices_created_at_trigger

-- DROP TRIGGER IF EXISTS offices_created_at_trigger ON public.offices;

CREATE OR REPLACE TRIGGER offices_created_at_trigger
    BEFORE INSERT
    ON public.offices
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: offices_updated_at_trigger

-- DROP TRIGGER IF EXISTS offices_updated_at_trigger ON public.offices;

CREATE OR REPLACE TRIGGER offices_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.offices
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();