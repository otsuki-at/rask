#!/bin/bash

# Stop the script if any command fails
set -e

# Function to show help message
function show_help() {
  echo "Usage: $0 gem_name [gem_version]"
  echo ""
  echo "Options:"
  echo "  -h, --help    Show this help message"
  echo ""
  echo "Arguments:"
  echo "  gem_name      Name of the gem to add (required)"
  echo "  gem_version   Version of the gem to add (optional)"
  echo ""
  echo "Examples:"
  echo "  $0 rails         # Add 'rails' to the Gemfile"
  echo "  $0 rails 7.0.6   # Add 'rails' with version '7.0.6' to the Gemfile"
}

# Check for help option
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  show_help
  exit 0
fi

# Ensure gem_name is provided
if [ -z "$1" ]; then
  echo "Error: Gem name is required."
  echo "Usage: $0 gem_name [gem_version]"
  echo "Run '$0 --help' for more details."
  exit 1
fi

GEM_NAME=$1
GEM_VERSION=$2

# Get the directory where the script is located
SCRIPT_DIR=$(cd $(dirname "$0"); pwd)

# Specify the absolute path of the Gemfile (assuming the Gemfile is in the same directory as the script)
GEMFILE_PATH="$SCRIPT_DIR/../Gemfile"
GEMFILE_LOCK_PATH="$SCRIPT_DIR/../Gemfile.lock"

# Add the gem to the Gemfile
if [ -z "$GEM_VERSION" ]; then
  echo "gem '$GEM_NAME'" >> "$GEMFILE_PATH"
else
  echo "gem '$GEM_NAME', '$GEM_VERSION'" >> "$GEMFILE_PATH"
fi

echo "Added gem '$GEM_NAME' to the Gemfile at $GEMFILE_PATH."

# Run bundle install
bundle install

echo "Ran bundle install successfully."

# Add changes to git and commit
git add "$GEMFILE_PATH" "$GEMFILE_LOCK_PATH" 
git commit -m "Add gem '$GEM_NAME'"

echo "Committed changes for gem '$GEM_NAME'."
