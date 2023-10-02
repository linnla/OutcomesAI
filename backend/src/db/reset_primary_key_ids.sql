SELECT setval('acquisition_sources_id_seq', (SELECT MAX(id) FROM acquisition_sources));
SELECT setval('active_ingredients_id_seq', (SELECT MAX(id) FROM active_ingredients));
SELECT setval('administration_routes_id_seq', (SELECT MAX(id) FROM administration_routes));
SELECT setval('appointment_medication_procedures_id_seq', (SELECT MAX(id) FROM appointment_medication_procedures));
SELECT setval('appointment_types_id_seq', (SELECT MAX(id) FROM appointment_types));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
SELECT setval('biomarker_types_id_seq', (SELECT MAX(id) FROM biomarker_types));
SELECT setval('biomarkers_id_seq', (SELECT MAX(id) FROM biomarkers));
SELECT setval('diagnosis_codes_id_seq', (SELECT MAX(id) FROM diagnosis_codes));
SELECT setval('disorders_id_seq', (SELECT MAX(id) FROM disorders));
SELECT setval('dosage_forms_id_seq', (SELECT MAX(id) FROM dosage_forms));
SELECT setval('dosage_units_id_seq', (SELECT MAX(id) FROM dosage_units));
SELECT setval('public.episodes_of_care_id_seq', (SELECT MAX(id) FROM public.episodes_of_care));
SELECT setval('public.episodes_of_care_id_seq', (SELECT MAX(id) FROM public.integration_types));
SELECT setval('public.episodes_of_care_id_seq', (SELECT MAX(id) FROM public.integration_vendors));
SELECT setval('medications_dosages_id_seq', (SELECT MAX(id) FROM public.medication_dosages));
SELECT setval('public.medication_types_id_seq', (SELECT MAX(id) FROM public.medication_types));
SELECT setval('public.medications_id_seq', (SELECT MAX(id) FROM public.medications));
SELECT setval('public.offices_id_seq', (SELECT MAX(id) FROM public.offices));
SELECT setval('public.patients_id_seq', (SELECT MAX(id) FROM public.patients));
SELECT setval('public.practices_id_seq', (SELECT MAX(id) FROM public.practices));
SELECT setval('public.practitioners_id_seq', (SELECT MAX(id) FROM public.practitioners));
SELECT setval('public.procedure_categories_id_seq', (SELECT MAX(id) FROM public.procedure_categories));
SELECT setval('public.procedure_codes_id_seq', (SELECT MAX(id) FROM public.procedure_codes));
SELECT setval('public.roles_id_seq', (SELECT MAX(id) FROM public.roles));
SELECT setval('tms_coils_id_seq', (SELECT MAX(id) FROM tms_coils));
SELECT setval('tms_devices_id_seq', (SELECT MAX(id) FROM tms_devices));
SELECT setval('tms_protocols_id_seq', (SELECT MAX(id) FROM tms_protocols));
SELECT setval('tms_frequencies_id_seq', (SELECT MAX(id) FROM tms_frequencies));
SELECT setval('tms_pulse_types_id_seq', (SELECT MAX(id) FROM tms_pulse_types));
SELECT setval('tms_stimulation_sites_id_seq', (SELECT MAX(id) FROM tms_stimulation_sites));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));