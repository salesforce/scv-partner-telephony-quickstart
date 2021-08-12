#!/bin/bash
export LANG=C
export LC_CTYPE=C
find ./ -type f -exec sed -i '' 's/'"$1"'/'"$2"'/g' {} \;