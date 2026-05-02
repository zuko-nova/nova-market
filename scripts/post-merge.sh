#!/bin/bash
set -e

pnpm install --frozen-lockfile
pnpm --filter db push

if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "GITHUB_PERSONAL_ACCESS_TOKEN is not set — skipping GitHub sync."
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/../push-to-github.sh"
