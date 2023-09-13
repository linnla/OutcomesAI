-- Table: public.roles

-- DROP TABLE IF EXISTS public.roles;

CREATE TABLE IF NOT EXISTS public.roles
(
    id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
    name citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.roles
    OWNER to postgres;

-- Trigger: set_created_at_trigger

-- DROP TRIGGER IF EXISTS set_created_at_trigger ON public.roles;

CREATE OR REPLACE TRIGGER set_created_at_trigger
    BEFORE INSERT
    ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: set_updated_at_trigger

-- DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.roles;

CREATE OR REPLACE TRIGGER set_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();