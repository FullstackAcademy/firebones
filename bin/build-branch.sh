#!/bin/bash

# Paths to add to the deployment branch.
#
# These paths will be added with git add -f, to include build artifacts
# we normally ignore in the branch we push to heroku.
build_paths="public"

# colors
red='\033[0;31m'
blue='\033[0;34m'
off='\033[0m'

echoed() {
    echo "${blue}${*}${off}"
    $*
}

if [[ $(git status --porcelain 2> /dev/null | grep -v '$\?\?' | tail -n1) != "" ]]; then
  echo "${red}Uncommitted changes would be lost. Commit or stash these changes:${off}"
  git status
  exit 1
fi

# Our branch name is build/commit-sha-hash
version="$(git log -n1 --pretty=format:%H)"
branch_name="build/${version}"


function create_build_branch() {
  git branch "${branch_name}"
  git checkout "${branch_name}"
  return 0
}

function commit_build_artifacts() {
  # Add our build paths. -f means "even if it's in .gitignore'".
  git add -f "${build_paths}"

  # Commit the build artifacts on the branch.
  git commit -a -m "Built ${version} on $(date)."  

  # Always succeed.
  return 0
}

# We expect to be sourced by some file that defines a deploy
# function. If deploy() isn't defined, define a stub function.
if [[ -z $(type -t deploy) ]]; then
  function deploy() {
    echo '(No deployment step defined.)'
    return 0
  }
fi

(
  create_build_branch &&  
  echoed yarn &&
  echoed npm run build &&
  commit_build_artifacts &&
  deploy
 
  # Regardless of whether we succeeded or failed, go back to
  # the previous branch.
  git checkout -
)
