-- Table: public.biomarkers

-- DROP TABLE IF EXISTS public.biomarkers;

CREATE TABLE IF NOT EXISTS public.biomarkers
(
    id integer NOT NULL DEFAULT nextval('biomarkers_id_seq'::regclass),
    biomarker_type_id integer NOT NULL,
    acronym citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    name citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    biomarker_values character varying[] COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT biomarkers_pkey PRIMARY KEY (id),
    CONSTRAINT biomarkers_acronym UNIQUE (acronym),
    CONSTRAINT biomarkers_name UNIQUE (name),
    CONSTRAINT "biomarkers-biomarker-type-id" FOREIGN KEY (biomarker_type_id)
        REFERENCES public.biomarker_types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.biomarkers
    OWNER to postgres;

-- Trigger: set_created_at_trigger

-- DROP TRIGGER IF EXISTS set_created_at_trigger ON public.biomarkers;

CREATE OR REPLACE TRIGGER set_created_at_trigger
    BEFORE INSERT
    ON public.biomarkers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: set_updated_at_trigger

-- DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.biomarkers;

CREATE OR REPLACE TRIGGER set_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.biomarkers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();