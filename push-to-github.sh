#!/bin/bash
set -e

GITHUB_USER="zuko-nova"
REPO_NAME="workspace"
REMOTE_URL="https://${GITHUB_USER}:${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "Setting up GitHub remote..."
git config user.name "zuko nova"
git config user.email "zuko-nova@users.noreply.github.com"

if git remote get-url github &>/dev/null; then
  git remote set-url github "$REMOTE_URL"
  echo "Updated existing remote."
else
  git remote add github "$REMOTE_URL"
  echo "Added GitHub remote."
fi

echo "Pushing to github.com/${GITHUB_USER}/${REPO_NAME}..."
git push github main

echo ""
echo "Done! Your code is live at: https://github.com/${GITHUB_USER}/${REPO_NAME}"
