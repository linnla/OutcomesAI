#!/bin/zsh

# Check if the "directory" parameter is provided
if [ $# -eq 0 ]; then
  echo "Error: Please provide a directory as an argument."
  exit 1
fi

# Variables
stage="dev"
directory="$1"  # Get the directory from the first command-line argument

# Source the file containing directory arrays
source subdirectories.sh

# Define an array of file paths
file_paths=("serverless.yml" "handler.py")

# Function to deploy a directory
deploy_directory() {
    local subdir="$1"
    echo "********************************************"

    # Check if the directory exists
    if [[ -d "$subdir" ]]; then
        cd "$subdir" || exit
        echo "Current directory: $(pwd)"

        # Iterate through the array of file paths
        for file_path in "${file_paths[@]}"; do
            if [ ! -e "$file_path" ]; then
                echo "File NOT Found: $file_path"
                break  # Exit the loop if the file doesn't exist
            else
                echo "File Found: $file_path"
            fi
        done

        if [[ "$stage" == "dev" ]]; then
            echo "Deploying $(pwd) to stage dev"
            sls deploy -s "$stage" &
        else
            echo "Invalid stage: $stage"
        fi

        cd ..
    else
        echo "Error: ***** Directory $subdir not found! *****"
    fi
}

# Check if the provided directory matches one of the predefined arrays
case "$directory" in
    transactional_data)
        cd "$directory" || exit
        echo "Transactional Data Directory: $(pwd)"
        for subdir in "${transactional_directories[@]}"; do
            deploy_directory "$subdir"
        done
        cd ..
        ;;
    master_data)
        cd "$directory" || exit
        echo "Master Data Directory: $(pwd)"
        for subdir in "${master_directories[@]}"; do
            deploy_directory "$subdir"
        done
        cd ..
        ;;
    reference_data)
        cd "$directory" || exit
        echo "Reference Data Directory: $(pwd)"
        for subdir in "${reference_directories[@]}"; do
            deploy_directory "$subdir"
        done
        cd ..
        ;;
    drchrono_api)
        cd "$directory" || exit
        echo "DrChrono API Directory: $(pwd)"
        for subdir in "${drchrono_directories[@]}"; do
            deploy_directory "$subdir"
        done
        cd ..
        ;;
    *)
        # If the directory is not one of the predefined ones, deploy it directly
        deploy_directory "$directory"
        ;;
esac

wait
