#!/usr/bin/env bash
# Checks the product repo (extension + backend) out into ./product. The site reads
# its CHANGELOG.md and web/manifest.json at build time; nothing else crosses over.
# REF defaults to main; set it to a tag to build against a release.
set -euo pipefail
cd "$(dirname "$0")/.."
REPO="${PRODUCT_REPO:-https://github.com/WindoM-app/windom.git}"
REF="${REF:-main}"
rm -rf product
git clone --quiet --depth 1 --branch "$REF" "$REPO" product
echo "product @ $(git -C product rev-parse --short HEAD) ($REF)"
