-- Type: citext

-- DROP TYPE IF EXISTS public.citext;

CREATE TYPE public.citext
(
    INPUT = citextin,
    OUTPUT = citextout,
    RECEIVE = citextrecv,
    SEND = citextsend,
    INTERNALLENGTH = -1,
    ALIGNMENT =  int4,
    STORAGE =  EXTENDED,
    CATEGORY = 'S',
    DELIMITER = ',',
    COLLATABLE = True
);

ALTER TYPE public.citext
    OWNER TO rdsadmin;
