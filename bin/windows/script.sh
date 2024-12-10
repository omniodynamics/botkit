#!/bin/bash

# Check if an argument was provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <command>"
    exit 1
fi

# Use cygstart to launch a new elevated shell with the command
cygstart --action=runas /bin/bash -c "$*"