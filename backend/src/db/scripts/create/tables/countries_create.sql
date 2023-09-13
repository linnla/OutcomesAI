-- Table: public.countries

-- DROP TABLE IF EXISTS public.countries;

CREATE TABLE IF NOT EXISTS public.countries
(
    country_code character(2) COLLATE pg_catalog."default" NOT NULL,
    country citext COLLATE pg_catalog."en_US.utf8" NOT NULL,
    CONSTRAINT countries_pkey PRIMARY KEY (country_code),
    CONSTRAINT countries_country UNIQUE (country)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.countries
    OWNER to postgres;