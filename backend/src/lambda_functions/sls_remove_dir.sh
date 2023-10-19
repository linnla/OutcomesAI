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
            sls remove -s "$stage" &
        else
            echo "Invalid stage: $stage"
        fi
        cd ..
    else
        echo "Error: ***** Directory $directory not found! *****"
    fi
}


# Check if the provided directory matches one of the predefined arrays
if [[ "$directory" == "transactional_data" ]]; then
    cd "$directory" || exit
    echo "Transactional Data Directory: $(pwd)"
    for subdir in "${transactional_directories[@]}"; do
        deploy_directory "$subdir"
    done
    cd ..
else
    # If the directory is not one of the predefined ones, deploy it directly
    deploy_directory "$directory"
fi


# Check if the provided directory matches one of the predefined arrays
if [[ "$directory" == "master_data" ]]; then
    cd "$directory" || exit
    echo "Master Data Directory: $(pwd)"
    for subdir in "${master_directories[@]}"; do
        deploy_directory "$subdir"
    done
    cd ..
else
    # If the directory is not one of the predefined ones, deploy it directly
    deploy_directory "$directory"
fi


# Check if the provided directory matches one of the predefined arrays
if [[ "$directory" == "reference_data" ]]; then
    cd "$directory" || exit
    echo "Reference Data Directory: $(pwd)"
    for subdir in "${reference_directories[@]}"; do
        deploy_directory "$subdir"
    done
    cd ..
else
    # If the directory is not one of the predefined ones, deploy it directly
    deploy_directory "$directory"
fi


# Check if the provided directory matches one of the predefined arrays
if [[ "$directory" == "drchrono_api" ]]; then
    cd "$directory" || exit
    echo "DrChrono API Directory: $(pwd)"
    for subdir in "${drchrono_directories[@]}"; do
        deploy_directory "$subdir"
    done
    cd ..
else
    # If the directory is not one of the predefined ones, deploy it directly
    deploy_directory "$directory"
fi

wait
