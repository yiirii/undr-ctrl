#!/usr/bin/env bash
# Build the Windows installer and publish it as a GitHub Release so installed laptops update themselves.
# Usage: ./scripts/release.sh   (uses the version in package.json; bump it first)
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(node -p "require('./package.json').version")
[ -f release/Undr-Ctrl-Setup.exe ] && [ -f release/latest.yml ] && grep -q "version: $V" release/latest.yml || npm run dist
grep -q "version: $V" release/latest.yml || { echo "release/latest.yml is not for $V"; exit 1; }
gh release view "v$V" -R yiirii/undr-ctrl >/dev/null 2>&1 && { echo "v$V already released"; exit 0; }
gh release create "v$V" -R yiirii/undr-ctrl --target main --title "Undr Ctrl $V" --notes "${NOTES:-Undr Ctrl $V}" \
  release/Undr-Ctrl-Setup.exe release/Undr-Ctrl-Setup.exe.blockmap release/latest.yml
echo "released v$V"
