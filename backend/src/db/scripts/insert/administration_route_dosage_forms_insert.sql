-- Define INSERT statements for administration_routes_dosage_forms
INSERT INTO administration_route_dosage_forms (administration_route_id, dosage_form_id, status) VALUES
-- Oral administration routes
(1, 1, 'Active'),  -- Tablet
(1, 2, 'Active'),  -- Capsule
(1, 3, 'Active'),  -- Liquid
(1, 4, 'Active'),  -- Caplet
(1, 5, 'Active'),  -- Lozenge
(1, 15, 'Active'), -- Wafer
(1, 17, 'Active'), -- Softgel Capsules
(1, 18, 'Active'), -- Effervescent Tablets
(1, 21, 'Active'), -- Film
(1, 25, 'Active'), -- Granule
(1, 26, 'Active'), -- Powder
(1, 28, 'Active'), -- Gum

-- Topical administration routes
(2, 3, 'Active'),  -- Liquid
(2, 6, 'Active'),  -- Gel
(2, 7, 'Active'),  -- Ointment
(2, 8, 'Active'),  -- Cream
(2, 10, 'Active'), -- Patch
(2, 16, 'Active'), -- Lotion
(2, 24, 'Active'), -- Emulsion
(2, 26, 'Active'), -- Powder
(2, 27, 'Active'), -- Foam

-- Inhalation administration routes
(3, 9, 'Active'),  -- Inhaler
(3, 12, 'Active'), -- Spray

-- Nasal administration routes
(4, 12, 'Active'), -- Spray
(4, 14, 'Active'), -- Drops

-- Rectal administration routes
(5, 11, 'Active'), -- Suppository

-- Subcutaneous administration routes
(6, 13, 'Active'), -- Injection

-- Intramuscular administration routes
(7, 13, 'Active'), -- Injection

-- Intravenous administration routes
(8, 13, 'Active'), -- Injection
(8, 19, 'Active'), -- Solution
(8, 20, 'Active'), -- Infusion

-- Sublingual/Buccal administration routes
(9, 1, 'Active'),  -- Tablet
(9, 5, 'Active'),  -- Lozenge
(9, 15, 'Active'), -- Wafer
(9, 21, 'Active'), -- Film

-- Ophthalmic administration routes
(10, 14, 'Active'), -- Drops

-- Otic administration routes
(11, 14, 'Active'), -- Drops

-- Transdermal administration routes
(12, 10, 'Active'), -- Patch

-- Vaginal administration routes
(13, 6, 'Active'),  -- Gel
(13, 7, 'Active'),  -- Ointment
(13, 11, 'Active'), -- Suppository

-- Intra-articular administration routes
(14, 13, 'Active'), -- Injection

-- Intrathecal administration routes
(15, 13, 'Active'), -- Injection

-- Intradermal administration routes
(16, 13, 'Active'), -- Injection

-- Intraperitoneal administration routes
(17, 13, 'Active'), -- Injection

-- Epidural administration routes
(18, 13, 'Active'), -- Injection

-- Enteral administration routes
(19, 3, 'Active'),  -- Liquid
(19, 25, 'Active'); -- Granule

-- For other routes, specific medications or special cases will dictate associations.
-- This isn't an exhaustive list and should be adjusted per medical guidelines and practices.
;
