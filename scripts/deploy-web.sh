#!/usr/bin/env bash
# Build the iPhone (web) app and publish it to GitHub Pages: https://yiirii.github.io/undr-ctrl/
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=${REPO:-https://github.com/yiirii/undr-ctrl}
npx vite build --outDir dist-web --emptyOutDir >/dev/null
touch dist-web/.nojekyll
STAMP=$(date -u +%Y%m%d%H%M%S)
sed -i "s/undr-ctrl-v1/undr-ctrl-$STAMP/" dist-web/sw.js   # new cache name per release → phones pick up the update
TMP=$(mktemp -d)
cp -r dist-web/. "$TMP"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -qm "Deploy Undr Ctrl web $STAMP"
git push -f "$REPO" gh-pages
echo "Deployed: https://yiirii.github.io/undr-ctrl/"
