#!/bin/bash

# List of function directories
function_directories=("biomarker_types" "biomarkers" "countries" "offices" "patients" "postal_codes" "practices" "practitioners" "roles" "users" "patient_biomarkers" "practice_users" "practice_patients" "practice_practitioners")

# Stage variable
stage="dev"

# Echo the current directory
current_dir=$(pwd)
echo "Current directory: $current_dir"

# Loop through each function directory
for function_dir in "${function_directories[@]}"; do
  # Change to the function directory
  cd "$function_dir" || exit

  # Echo the current directory
  current_dir=$(pwd)
  echo "Current directory: $current_dir"

  # Copy the files to the deployment directory
  cp -v ../../lambda_libs/database_crud.py .
  cp -v ../../lambda_libs/database.py .

  # Check the stage variable
  if [[ "$stage" == "dev" ]]; then
    # Deploy the function with the specified stage in the background
    sls deploy -s "$stage" &
  else
    # Handle other stages or invalid stage values
    echo "Invalid stage: $stage"
  fi

  # Change back to the main directory
  cd ..

done

# Wait for all deployments to finish
wait
