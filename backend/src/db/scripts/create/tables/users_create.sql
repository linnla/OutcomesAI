-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    cognito_id character varying(85) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

-- Trigger: set_created_at_trigger

-- DROP TRIGGER IF EXISTS set_created_at_trigger ON public.users;

CREATE OR REPLACE TRIGGER set_created_at_trigger
    BEFORE INSERT
    ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: set_updated_at_trigger

-- DROP TRIGGER IF EXISTS set_updated_at_trigger ON public.users;

CREATE OR REPLACE TRIGGER set_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();