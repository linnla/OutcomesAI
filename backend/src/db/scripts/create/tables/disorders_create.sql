-- Table: public.disorders

-- DROP TABLE IF EXISTS public.disorders;

CREATE TABLE IF NOT EXISTS public.disorders
(
    id integer NOT NULL DEFAULT nextval('disorders_id_seq'::regclass),
    name character varying(75) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT disorders_pkey PRIMARY KEY (id),
    CONSTRAINT disorder_name UNIQUE (name),
    CONSTRAINT check_status CHECK (status::text = ANY (ARRAY['Active'::character varying::text, 'Inactive'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.disorders
    OWNER to postgres;

-- Trigger: disorders_created_at_trigger

-- DROP TRIGGER IF EXISTS disorders_created_at_trigger ON public.disorders;

CREATE OR REPLACE TRIGGER disorders_created_at_trigger
    BEFORE INSERT
    ON public.disorders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: disorders_updated_at_trigger

-- DROP TRIGGER IF EXISTS disorders_updated_at_trigger ON public.disorders;

CREATE OR REPLACE TRIGGER disorders_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.disorders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();