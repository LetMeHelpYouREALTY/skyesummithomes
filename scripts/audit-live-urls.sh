#!/usr/bin/env bash
# Quick production URL status check for skyesummithomes.com
set -euo pipefail

BASE="${1:-https://www.skyesummithomes.com}"
PATHS=(
  /
  /about
  /contact
  /skye-summit-realtor
  /skye-summit-faq
  /las-vegas-zip-code-map
  /search
  /office-location
)

echo "Auditing $BASE"
echo "path | status | last-modified"
echo "-----|--------|---------------"

for path in "${PATHS[@]}"; do
  headers=$(curl -sI "${BASE}${path}")
  status=$(echo "$headers" | awk '/^HTTP/{print $2; exit}')
  lm=$(echo "$headers" | awk -F': ' 'tolower($1)=="last-modified"{print $2; exit}')
  printf "%s | %s | %s\n" "$path" "${status:-?}" "${lm:-—}"
done
