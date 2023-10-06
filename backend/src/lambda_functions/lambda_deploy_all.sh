#!/bin/zsh

# Variables
stage="dev"
transactional_data="transactional_data"
transactional_directories=("episodes_of_care" "episodes_of_care_diagnosis_codes"
"patient_appointments" "patient_diagnosis" "patient_medications")

drchrono_data="drchrono_api"

master_data="master_data"
master_directories=("offices" "patient_biomarkers" "patients" "practice_integrations" 
"practice_patients" "practice_practitioners" "practice_tms_devices" 
"practice_tms_protocols" "practice_users" "practices" "practitioners" "users")

reference_data="reference_data"
reference_directories=("acquisition_sources" "active_ingredients" 
"administration_routes" "appointment_types" "biomarker_types" "biomarkers" 
"countries" "country_code_utils" "diagnosis_codes" "disorders" "dosage_forms" 
"dosage_units" "integration_types" "integration_vendors" "medication_types" 
"postal_code_utils_us" "postal_codes" "procedure_categories" "procedure_codes" 
"roles" "tms_coils" "tms_devices" "tms_frequencies" "tms_protocols" 
"tms_pulse_types" "tms_stimulation_sites")

# Functions
deploy_directory() {
    echo "********************************************"
    local directory=$1

    # Check if directory exists
    if [[ -d "$directory" ]]; then
        cd "$directory" || exit
        echo "Current directory: $(pwd)"

        if [[ "$stage" == "dev" ]]; then
            echo "Deploying $(pwd) to stage dev"
            sls deploy -s "$stage" &
        else
            echo "Invalid stage: $stage"
        fi
        cd ..
    else
        echo "Error: ***** Directory $directory not found! *****"
    fi
}

# Master Data
cd "$master_data" || exit
echo "Master Data Directory: $(pwd)"
for directory in "${master_directories[@]}"; do
    deploy_directory "$directory"
done
cd ..

# Reference Data
cd "$reference_data" || exit
echo "Reference Data Directory: $(pwd)"
for directory in "${reference_directories[@]}"; do
    deploy_directory "$directory"
done
cd ..

# Transactional Data
cd "$transactional_data" || exit
echo "Transactional Data Directory: $(pwd)"
for directory in "${transactional_directories[@]}"; do
    deploy_directory "$directory"
done
cd ..

# drchrono Data
deploy_directory "$drchrono_data"

cd ..
echo "Current directory: $(pwd)"
wait
