#!/usr/bin/env bash
# Publish a new laptop version: GitHub Actions (.github/workflows/release.yml) builds the installer on Windows
# and publishes the release; installed laptops then update themselves.
# Usage: bump "version" in package.json, commit, then ./scripts/release.sh
set -euo pipefail
cd "$(dirname "$0")/.."
V=$(node -p "require('./package.json').version")
git tag -f "v$V"
git push -q https://github.com/yiirii/undr-ctrl master:main
git push -q -f https://github.com/yiirii/undr-ctrl "v$V"
echo "tagged v$V; GitHub is building it: https://github.com/yiirii/undr-ctrl/actions"
