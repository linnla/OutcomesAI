-- Table: public.biomarker_types

-- DROP TABLE IF EXISTS public.biomarker_types;

CREATE TABLE IF NOT EXISTS public.biomarker_types
(
    id integer NOT NULL DEFAULT nextval('biomarker_types_id_seq'::regclass),
    name citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT biomarker_types_pkey PRIMARY KEY (id),
    CONSTRAINT biomarker_types_name UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.biomarker_types
    OWNER to postgres;

-- Trigger: set_created_at_trigger

-- DROP TRIGGER IF EXISTS set_created_at_trigger ON public.biomarker_types;

CREATE OR REPLACE TRIGGER set_created_at_trigger
    BEFORE INSERT
    ON public.biomarker_types
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: set_updated_at_trigger

-- DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.biomarker_types;

CREATE OR REPLACE TRIGGER set_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.biomarker_types
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();