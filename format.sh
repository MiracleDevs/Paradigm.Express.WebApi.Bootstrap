#!/bin/bash
# shellcheck disable=SC1090
CURRENT_PATH=$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
)
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_RESET='\033[0m'

function error() {
    echo -e "${C_RED}ERROR: ${1}${C_RESET}"
    exit 1
}

function message() {
    echo -e "${C_GREEN}${1}${C_RESET}"
}

message "---------------------------------------------------"
message "Formatting website source code: "
message "---------------------------------------------------"
pushd "$CURRENT_PATH"                                               || error "Unable to change to the website folder."
npm run format                                                      || error "Unable to format the source code."
popd                                                                || error "Unable to change folder."
