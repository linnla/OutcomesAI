-- Table: public.episodes_of_care_diagnosis_codes

-- DROP TABLE IF EXISTS public.episodes_of_care_diagnosis_codes;

CREATE TABLE IF NOT EXISTS public.episodes_of_care_diagnosis_codes
(
    episodes_of_care_id integer NOT NULL,
    diagnosis_codes_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT episodes_of_care_diagnosis_codes_diagnosis_codes_id_fkey FOREIGN KEY (diagnosis_codes_id)
        REFERENCES public.diagnosis_codes (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT episodes_of_care_diagnosis_codes_episodes_of_care_id_fkey FOREIGN KEY (episodes_of_care_id)
        REFERENCES public.episodes_of_care (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.episodes_of_care_diagnosis_codes
    OWNER to postgres;

-- Trigger: episodes_of_care_diagnosis_codes_created_at_trigger

-- DROP TRIGGER IF EXISTS episodes_of_care_diagnosis_codes_created_at_trigger ON public.episodes_of_care_diagnosis_codes;

CREATE OR REPLACE TRIGGER episodes_of_care_diagnosis_codes_created_at_trigger
    BEFORE INSERT
    ON public.episodes_of_care_diagnosis_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_created_at();

-- Trigger: episodes_of_care_diagnosis_codes_updated_at_trigger

-- DROP TRIGGER IF EXISTS episodes_of_care_diagnosis_codes_updated_at_trigger ON public.episodes_of_care_diagnosis_codes;

CREATE OR REPLACE TRIGGER episodes_of_care_diagnosis_codes_updated_at_trigger
    BEFORE INSERT OR UPDATE 
    ON public.episodes_of_care_diagnosis_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();