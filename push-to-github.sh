#!/bin/bash
set -e

# Manual fallback for pushing to GitHub.
# This runs automatically after every task merge via scripts/post-merge.sh.

GITHUB_USER="zuko-nova"
REPO_NAME="nova-market"

if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "Error: GITHUB_PERSONAL_ACCESS_TOKEN is not set."
  echo "Add it as a secret in the Replit environment secrets."
  exit 1
fi

REMOTE_URL="https://${GITHUB_USER}:${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

git config user.name "zuko nova"
git config user.email "zuko-nova@users.noreply.github.com"

if git remote get-url github &>/dev/null; then
  git remote set-url github "$REMOTE_URL"
else
  git remote add github "$REMOTE_URL"
fi

echo "Pushing to github.com/${GITHUB_USER}/${REPO_NAME}..."
git push github main
echo "Done! https://github.com/${GITHUB_USER}/${REPO_NAME}"
