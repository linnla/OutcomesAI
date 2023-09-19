#!/bin/bash

# Variables
stage="dev"
master_data="master_data"
master_directories=("offices" "patient_biomarkers" "patients" "practice_tms_devices" "practice_patients" "practice_practitioners" "practice_users" "practices" "practitioners" "users")
reference_data="reference_data"
reference_directories=("acquisition_sources" "active_ingredients" "administration_routes" "appointment_types" "biomarker_types" "biomarkers" "countries" "tms_devices" "tms_coils" "tms_device_coils" "diagnosis_codes" "disorders" "dosage_forms" "dosage_units" "medication_types" "postal_codes" "procedure_categories" "procedure_codes" "roles" "tms_protocols" "tms_frequencies" "tms_pulse_types" "tms_stimulation_sites")

lambda_libs_path="/Users/laurelinn/dev/OutcomesAI/backend/src/lambda_libs"

# Functions
deploy_directory() {
    echo "********************************************"
    local directory=$1

    # Check if directory exists
    if [[ -d "$directory" ]]; then
        cd "$directory" || exit
        echo "Current directory: $(pwd)"

        # Check if files exist before copying
        if [[ ! -f "$lambda_libs_path/database_crud.py" ]]; then
            echo "Error: ***** File database_crud.py not found! *****"
            exit 1
        fi

        cp -v "$lambda_libs_path/database_crud.py" .
        cp -v "$lambda_libs_path/database.py" .

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

# Main Execution
cd "$master_data" || exit
echo "Master Data Directory: $(pwd)"
for directory in "${master_directories[@]}"; do
    deploy_directory "$directory"
done
cd ..

cd "$reference_data" || exit
echo "Reference Data Directory: $(pwd)"
for directory in "${reference_directories[@]}"; do
    deploy_directory "$directory"
done

cd ..
echo "Current directory: $(pwd)"
wait
