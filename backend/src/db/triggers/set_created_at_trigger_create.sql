-- FUNCTION: public.set_created_at()

-- DROP FUNCTION IF EXISTS public.set_created_at();

CREATE OR REPLACE FUNCTION public.set_created_at()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    NEW.created_at = NOW(); -- Set the current timestamp
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.set_created_at()
    OWNER TO postgres;
