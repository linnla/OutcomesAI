-- FUNCTION: public.set_updated_at()

-- DROP FUNCTION IF EXISTS public.set_updated_at();

CREATE OR REPLACE FUNCTION public.set_updated_at()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    NEW.updated_at = NOW(); -- Set the current timestamp
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.set_updated_at()
    OWNER TO postgres;
