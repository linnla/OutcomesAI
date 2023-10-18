ALTER TABLE IF EXISTS public.offices
    ALTER COLUMN name TYPE citext COLLATE "en_US.utf8",
    ADD CONSTRAINT offices_name UNIQUE (name);

