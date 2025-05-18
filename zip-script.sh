#!/bin/bash

# Define the output zip file name
ZIP_NAME="soundboard_preedit.zip"
# Get the name of this script
SCRIPT_NAME=$(basename "$0")

echo "Cleaning up project and creating $ZIP_NAME..."

# Remove any existing zip file
rm -f "$ZIP_NAME"

# Use find to create a list of files to include, excluding unwanted patterns
find . -type f -not -path "*/node_modules/*" \
       -not -path "*/.venv/*" \
       -not -path "*/.env/*" \
       -not -path "*/.git/*" \
       -not -path "*/__MACOSX/*" \
       -not -name ".DS_Store" \
       -not -path "*/packages/*" \
       -not -path "*/vendor/*" \
       -not -path "*/.next/*" \
       -not -path "*/.cache/*" \
       -not -path "*/dist/*" \
       -not -path "*/build/*" \
       -not -path "*/out/*" \
       -not -path "*/.vscode/*" \
       -not -path "*/.idea/*" \
       -not -name "*.log" \
       -not -path "*/temp/*" \
       -not -name ".gitattributes" \
       -not -name "$SCRIPT_NAME" \
       | zip -@ "$ZIP_NAME"

echo "Done! Created $ZIP_NAME without the excluded files and directories."
