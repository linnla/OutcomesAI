-- Table: public.postal_codes

-- DROP TABLE IF EXISTS public.postal_codes;

CREATE TABLE IF NOT EXISTS public.postal_codes
(
    postal_code character(5) COLLATE pg_catalog."default" NOT NULL,
    postal_code_type character varying(35) COLLATE pg_catalog."default",
    city character varying(85) COLLATE pg_catalog."default",
    state character varying(85) COLLATE pg_catalog."default",
    state_code character(2) COLLATE pg_catalog."default",
    county character varying(105) COLLATE pg_catalog."default",
    time_zone character varying(85) COLLATE pg_catalog."default",
    country character varying(105) COLLATE pg_catalog."default",
    country_code character(2) COLLATE pg_catalog."default",
    latitude numeric,
    longitude numeric,
    irs_estimated_population integer,
    CONSTRAINT postal_codes_pkey PRIMARY KEY (postal_code),
    CONSTRAINT postal_code_country_code FOREIGN KEY (country_code)
        REFERENCES public.countries (country_code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.postal_codes
    OWNER to postgres;