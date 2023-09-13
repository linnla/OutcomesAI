-- Table: public.practice_users

-- DROP TABLE IF EXISTS public.practice_users;

CREATE TABLE IF NOT EXISTS public.practice_users
(
    practice_id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    status character varying(8) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Active'::character varying,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT practice_users_pkey PRIMARY KEY (practice_id, user_id),
    CONSTRAINT practice_practices_practice_id FOREIGN KEY (practice_id)
        REFERENCES public.practices (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT practice_users_role_id FOREIGN KEY (role_id)
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT practice_users_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT check_status CHECK (status::text = ANY (ARRAY['Active'::character varying::text, 'Inactive'::character varying::text]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.practice_users
    OWNER to postgres;

-- Trigger: practice_users_created_at_trigger

-- DROP TRIGGER IF EXISTS practice_users_created_at_trigger ON public.practice_users;

CREATE OR REPLACE TRIGGER practice_users_created_at_trigger
    BEFORE INSERT
    ON public.practice_users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: practice_users_updated_at_trigger

-- DROP TRIGGER IF EXISTS practice_users_updated_at_trigger ON public.practice_users;

CREATE OR REPLACE TRIGGER practice_users_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.practice_users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();