#!/bin/bash

_value1="$1"
if [ -z "$_value1" ]; then
    echo "There is no extension"
    exit 1
fi

node index.js $_value1
exit 0
