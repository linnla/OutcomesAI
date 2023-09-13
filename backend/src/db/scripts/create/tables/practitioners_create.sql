-- Table: public.practitioners

-- DROP TABLE IF EXISTS public.practitioners;

CREATE TABLE IF NOT EXISTS public.practitioners
(
    id integer NOT NULL DEFAULT nextval('practitioners_id_seq'::regclass),
    user_id integer,
    last_name character varying(85) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(85) COLLATE pg_catalog."default" NOT NULL,
    prefix character varying(12) COLLATE pg_catalog."default",
    suffix character varying(25) COLLATE pg_catalog."default",
    email citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT practitioners_pkey PRIMARY KEY (id),
    CONSTRAINT practitioners_email UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.practitioners
    OWNER to postgres;

-- Trigger: set_created_at_trigger

-- DROP TRIGGER IF EXISTS set_created_at_trigger ON public.practitioners;

CREATE OR REPLACE TRIGGER set_created_at_trigger
    BEFORE INSERT
    ON public.practitioners
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: set_updated_at_trigger

-- DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.practitioners;

CREATE OR REPLACE TRIGGER set_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.practitioners
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();