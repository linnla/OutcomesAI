---INSERT INTO medication_types (id, name, description, status)
---VALUES
---(1, 'Antidepressant', 'An antidepressant is a medication designed to alleviate symptoms of depression and improve mood by regulating neurotransmitters in the brain', 'Active');


-- Fluoxetine (1)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(1, 1, 'Prozac', 'Fluoxetine', 2, 4, 1, 1, 'Active'),
(2, 1, 'Prozac Weekly', 'Fluoxetine', 2, 4, 1, 1, 'Active'),
(3, 1, 'Prozac Oral Solution', 'Fluoxetine', 3, 6, 1, 1, 'Active'),
(4, 1, 'Sarafem', 'Fluoxetine', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(1, 1, 'Active'),
(2, 1, 'Active'),
(3, 1, 'Active'),
(4, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(1, 10, 'Active'),
(1, 20, 'Active'),
(1, 40, 'Active'),
(2, 90, 'Active'),
(3, 20, 'Active'),
(4, 10, 'Active'),
(4, 20, 'Active');


-- Sertraline (2)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(5, 2, 'Zoloft', 'Sertraline', 1, 4, 1, 1, 'Active'),
(6, 2, 'Zoloft Oral Concentrate', 'Sertraline', 3, 6, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(5, 1, 'Active'),
(6, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(5, 25, 'Active'),
(5, 50, 'Active'),
(5, 100, 'Active'),
(6, 20, 'Active');


-- Bupropion (3)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(7, 3, 'Wellbutrin', 'Bupropion', 1, 4, 1, 1, 'Active'),
(8, 3, 'Wellbutrin SR', 'Bupropion', 1, 4, 1, 1, 'Active'),
(9, 3, 'Wellbutrin XL', 'Bupropion', 1, 4, 1, 1, 'Active'),
(10, 3, 'Zyban', 'Bupropion', 1, 4, 1, 1, 'Active'),
(11, 3, 'Aplenzin', 'Bupropion', 1, 4, 1, 1, 'Active'),
(12, 3, 'Forfivo XL', 'Bupropion', 1, 4, 1, 1, 'Active'),
(13, 3, 'Bupropion HCl', 'Bupropion', 1, 4, 1, 1, 'Active'),
(14, 3, 'Bupropion SR', 'Bupropion', 1, 4, 1, 1, 'Active'),
(15, 3, 'Bupropion XL', 'Bupropion', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(7, 1, 'Active'),
(8, 1, 'Active'),
(9, 1, 'Active'),
(10, 1, 'Active'),
(11, 1, 'Active'),
(12, 1, 'Active'),
(13, 1, 'Active'),
(14, 1, 'Active'),
(15, 1, 'Active');


INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(7, 75, 'Active'),
(7, 100, 'Active'),
(8, 100, 'Active'),
(8, 150, 'Active'),
(8, 200, 'Active'),
(9, 150, 'Active'),
(9, 300, 'Active'),
(9, 450, 'Active'),
(10, 150, 'Active'),
(11, 174, 'Active'),
(11, 348, 'Active'),
(11, 522, 'Active'),
(12, 450, 'Active'),
(13, 75, 'Active'),
(13, 100, 'Active'),
(14, 100, 'Active'),
(14, 150, 'Active'),
(14, 200, 'Active'),
(15, 150, 'Active'),
(15, 300, 'Active');


-- Citalopram (4)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(16, 4, 'Celexa', 'Citalopram', 1, 4, 1, 1, 'Active'),
(17, 4, 'Citalopram', 'Citalopram', 1, 4, 1, 1, 'Active'),
(18, 4, 'Citalopram Oral Solution', 'Citalopram', 3, 6, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(16, 1, 'Active'),
(17, 1, 'Active'),
(18, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(16, 10, 'Active'),
(16, 20, 'Active'),
(16, 40, 'Active'),
(17, 10, 'Active'),
(17, 20, 'Active'),
(17, 40, 'Active'),
(18, 10, 'Active'),
(18, 20, 'Active');


-- Escitalopram (5)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(19, 5, 'Lexapro', 'Escitalopram', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(19, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(19, 5, 'Active'),
(19, 10, 'Active'),
(19, 20, 'Active');


-- Paroxetine (6)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(20, 6, 'Paxil', 'Paroxetine', 1, 4, 1, 1, 'Active'),
(21, 6, 'Paxil CR', 'Paroxetine', 1, 4, 1, 1, 'Active'),
(22, 6, 'Paxil Oral Suspension', 'Paroxetine', 1, 6, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(20, 1, 'Active'),
(21, 1, 'Active'),
(22, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(20, 10, 'Active'),
(20, 20, 'Active'),
(20, 30, 'Active'),
(20, 40, 'Active'),
(21, 12.5, 'Active'),
(21, 25, 'Active'),
(21, 37.5, 'Active'),
(22, 10, 'Active'),
(22, 20, 'Active');


-- Venlafaxine (7)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(23, 7, 'Effexor', 'Venlafaxine', 2, 4, 1, 1, 'Active'),
(24, 7, 'Effexor XL', 'Venlafaxine', 2, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(23, 1, 'Active'),
(24, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(23, 25, 'Active'),
(23, 37.5, 'Active'),
(23, 50, 'Active'),
(23, 75, 'Active'),
(23, 100, 'Active'),
(24, 37.5, 'Active'),
(24, 75, 'Active'),
(24, 150, 'Active'),
(24, 225, 'Active');


-- Desvenlafaxine (8)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(25, 8, 'Pristiq', 'Desvenlafaxine', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(25, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(25, 50, 'Active'),
(25, 100, 'Active');


-- Duloxetine (9)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(26, 9, 'Cymbalta', 'Duloxetine', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(26, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(26, 30, 'Active'),
(26, 60, 'Active');


-- Mirtazapine (10)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(27, 10, 'Remeron', 'Mirtazapine', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(27, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(27, 15, 'Active'),
(27, 30, 'Active'),
(27, 45, 'Active');


-- Trazodone (11)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(28, 11, 'Desyrel', 'Trazodone', 1, 4, 1, 1, 'Active'),
(29, 11, 'Trazadone', 'Trazodone', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(28, 1, 'Active'),
(29, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(28, 50, 'Active'),
(28, 100, 'Active'),
(29, 50, 'Active'),
(29, 100, 'Active');


-- Amitriptyline (12)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(30, 12, 'Elavil', 'Amitriptyline', 1, 4, 1, 1, 'Active'),
(31, 12, 'Endep', 'Amitriptyline', 1, 4, 1, 1, 'Active'),
(32, 12, 'Amitid', 'Amitriptyline', 1, 4, 1, 1, 'Active'),
(33, 12, 'Vanatrip', 'Amitriptyline', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(30, 1, 'Active'),
(31, 1, 'Active'),
(32, 1, 'Active'),
(33, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(30, 10, 'Active'),
(30, 25, 'Active'),
(30, 50, 'Active'),
(30, 75, 'Active'),
(30, 100, 'Active'),
(30, 150, 'Active'),
(31, 10, 'Active'),
(31, 25, 'Active'),
(31, 50, 'Active'),
(31, 75, 'Active'),
(31, 100, 'Active'),
(31, 150, 'Active'),
(32, 10, 'Active'),
(32, 25, 'Active'),
(32, 50, 'Active'),
(32, 75, 'Active'),
(32, 100, 'Active'),
(32, 150, 'Active'),
(33, 10, 'Active'),
(33, 25, 'Active'),
(33, 50, 'Active'),
(33, 75, 'Active'),
(33, 100, 'Active'),
(33, 150, 'Active');


-- Nortriptyline (13)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(34, 13, 'Pamelor', 'Nortriptyline', 1, 4, 1, 1, 'Active'),
(35, 13, 'Aventyl', 'Nortriptyline', 1, 4, 1, 1, 'Active'),
(36, 13, 'Pamelor', 'Nortriptyline', 2, 4, 1, 1, 'Active'),
(37, 13, 'Aventyl', 'Nortriptyline', 2, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(34, 1, 'Active'),
(35, 1, 'Active'),
(36, 1, 'Active'),
(37, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(34, 10, 'Active'),
(34, 25, 'Active'),
(34, 50, 'Active'),
(34, 75, 'Active'),
(34, 100, 'Active'),
(35, 10, 'Active'),
(35, 25, 'Active'),
(35, 50, 'Active'),
(35, 75, 'Active'),
(35, 100, 'Active'),
(36, 10, 'Active'),
(36, 25, 'Active'),
(36, 50, 'Active'),
(36, 75, 'Active'),
(36, 100, 'Active'),
(37, 10, 'Active'),
(37, 25, 'Active'),
(37, 50, 'Active'),
(37, 75, 'Active'),
(37, 100, 'Active');


-- Fluvoxamine (14)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(38, 14, 'Luvox', 'Fluvoxamine', 2, 4, 1, 1, 'Active'),
(39, 14, 'Luvox CR', 'Fluvoxamine', 2, 4, 1, 1, 'Active'),
(40, 14, 'Luvox', 'Fluvoxamine', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(38, 1, 'Active'),
(39, 1, 'Active'),
(40, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(38, 25, 'Active'),
(38, 50, 'Active'),
(38, 100, 'Active'),
(39, 50, 'Active'),
(39, 100, 'Active'),
(40, 25, 'Active'),
(40, 50, 'Active'),
(40, 100, 'Active');

-- Viibryd (15)
INSERT INTO medications (id, active_ingredients_id, brand_name, generic_name, dosage_forms_id, dosage_units_id, acquisition_sources_id, administration_routes_id, status)
VALUES
(41, 15, 'Viibryd', 'Vilazodone Hydrochloride', 1, 4, 1, 1, 'Active');

INSERT INTO medication_type_medications (medication_id, medication_type_id, status)
VALUES
(41, 1, 'Active');

INSERT INTO medication_dosages (medication_id, dosage, status)
VALUES
(41, 10, 'Active'),
(41, 20, 'Active'),
(41, 40, 'Active');



--- for all brand names for Viibryd tablets
--- create insert statements for medications, INSERT INTO medications (id, active_ingredient_id, brand_name, generic_name, dosage_form_id, dosage_units_id, acquisition_source_id, administration_routes_id)
--- starting id = 40, active_ingredient_id = 13, dosage_form_id = 1, dosage_units_id = 4, administration_routes_id = 1, acquisition_source_id = 1
