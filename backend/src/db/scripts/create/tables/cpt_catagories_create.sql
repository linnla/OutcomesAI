-- Table: public.cpt_categories

-- DROP TABLE IF EXISTS public.cpt_categories;

CREATE TABLE IF NOT EXISTS public.cpt_categories
(
    id integer NOT NULL DEFAULT nextval('cpt_categories_id_seq'::regclass),
    name character varying(55) COLLATE pg_catalog."default" NOT NULL,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT cpt_categories_pkey PRIMARY KEY (id),
    CONSTRAINT name UNIQUE (name),
    CONSTRAINT check_status CHECK (status::text = ANY (ARRAY['Active'::character varying::text, 'Inactive'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.cpt_categories
    OWNER to postgres;

-- Trigger: cpt_categories_created_at_trigger

-- DROP TRIGGER IF EXISTS cpt_categories_created_at_trigger ON public.cpt_categories;

CREATE OR REPLACE TRIGGER cpt_categories_created_at_trigger
    BEFORE INSERT
    ON public.cpt_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: cpt_categories_updated_at_trigger

-- DROP TRIGGER IF EXISTS cpt_categories_updated_at_trigger ON public.cpt_categories;

CREATE OR REPLACE TRIGGER cpt_categories_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.cpt_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();