# By default, we git push our build branch to heroku master.
# You can specify DEPLOY_REMOTE and DEPLOY_BRANCH to configure
# this.
deploy_remote="${DEPLOY_REMOTE:-heroku}"
deploy_branch="${DEPLOY_BRANCH:-master}"

deploy() {
  git push -f "$deploy_remote" "$branch_name:$deploy_branch" 
}

. "$(dirname $0)/build-branch.sh"
