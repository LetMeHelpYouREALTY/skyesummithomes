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

echo
echo "GSC redirect checks (non-canonical hosts should 301/308 to www HTTPS)"
REDIRECT_URLS=(
  "http://www.skyesummithomes.com/"
  "http://skyesummithomes.com/"
  "https://skyesummithomes.com/"
)

for url in "${REDIRECT_URLS[@]}"; do
  headers=$(curl -sI "$url")
  status=$(echo "$headers" | awk '/^HTTP/{print $2; exit}')
  location=$(echo "$headers" | awk -F': ' 'tolower($1)=="location"{print $2; exit}' | tr -d '\r')
  printf "%s | %s | %s\n" "$url" "${status:-?}" "${location:-—}"
done
