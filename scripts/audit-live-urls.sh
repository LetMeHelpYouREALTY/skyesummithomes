#!/usr/bin/env bash
# Quick production URL status check for skyesummithomes.com
set -euo pipefail

BASE="${1:-https://www.skyesummithomes.com}"
PATHS=(
  /
  /about
  /contact
  /invest
  /sell
  /buy
  /valuation
  /skye-summit-realtor
  /skye-summit-faq
  /las-vegas-zip-code-map
  /search
  /office-location
  /skye-summit-master-plan
  /skye-summit-interest-list
  /kb-home-vertice-skye-summit
  /homes-for-sale-skye-summit
  /new-construction-skye-summit
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
  "https://skyesummithomes.com/?s=test"
  "https://skyesummithomes.com/invest"
  "https://skyesummithomes.com/invest/"
  "https://www.skyesummithomes.com/las-vegas-zip-code-map/"
  "https://skyesummithomes.com/las-vegas-zip-code-map/"
)

for url in "${REDIRECT_URLS[@]}"; do
  headers=$(curl -sI "$url")
  status=$(echo "$headers" | awk '/^HTTP/{print $2; exit}')
  location=$(echo "$headers" | awk -F': ' 'tolower($1)=="location"{print $2; exit}' | tr -d '\r')
  printf "%s | %s | %s\n" "$url" "${status:-?}" "${location:-—}"
  # Follow chain — must land on www HTTPS without slash, <=2 hops
  final=$(curl -sI -L --max-redirs 5 -o /dev/null -w '%{url_effective}|%{http_code}|%{num_redirects}' "$url")
  printf "  follow → %s\n" "$final"
done

echo
echo "GSC apex 404 checks (must NOT be 404; should redirect to www)"
APEX_PATHS=(/invest /sell /valuation /buy /contact /about)

for path in "${APEX_PATHS[@]}"; do
  url="https://skyesummithomes.com${path}"
  headers=$(curl -sI "$url")
  status=$(echo "$headers" | awk '/^HTTP/{print $2; exit}')
  location=$(echo "$headers" | awk -F': ' 'tolower($1)=="location"{print $2; exit}' | tr -d '\r')
  printf "%s | %s | %s\n" "$url" "${status:-?}" "${location:-—}"
done

echo
echo "GSC asset checks (must be 200 on www)"
GSC_ASSETS=(
  /sitemap.xml
  /robots.txt
  /googlewKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI.html
)

for path in "${GSC_ASSETS[@]}"; do
  headers=$(curl -sI "${BASE}${path}")
  status=$(echo "$headers" | awk '/^HTTP/{print $2; exit}')
  printf "%s | %s\n" "$path" "${status:-?}"
done
