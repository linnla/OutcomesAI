-- Table: public.practices

-- DROP TABLE IF EXISTS public.practices;

CREATE TABLE IF NOT EXISTS public.practices
(
    id integer NOT NULL DEFAULT nextval('practices_id_seq'::regclass),
    name citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    postal_code character varying(12) COLLATE pg_catalog."default",
    city character varying(85) COLLATE pg_catalog."default",
    county character varying(85) COLLATE pg_catalog."default",
    state_code character(2) COLLATE pg_catalog."default",
    state character varying(85) COLLATE pg_catalog."default",
    country_code character(2) COLLATE pg_catalog."default" NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Active'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT practices_pkey PRIMARY KEY (id),
    CONSTRAINT practices_name UNIQUE (name),
    CONSTRAINT practices_name_city_state_code UNIQUE (name, city, state_code),
    CONSTRAINT practice_country_code FOREIGN KEY (country_code)
        REFERENCES public.countries (country_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT practice_postal_code FOREIGN KEY (postal_code)
        REFERENCES public.postal_codes (postal_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT check_status CHECK (status::text = ANY (ARRAY['Active'::character varying::text, 'Inactive'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.practices
    OWNER to postgres;

-- Trigger: practices_created_at_trigger

-- DROP TRIGGER IF EXISTS practices_created_at_trigger ON public.practices;

CREATE OR REPLACE TRIGGER practices_created_at_trigger
    BEFORE INSERT
    ON public.practices
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: practices_updated_at_trigger

-- DROP TRIGGER IF EXISTS practices_updated_at_trigger ON public.practices;

CREATE OR REPLACE TRIGGER practices_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.practices
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();