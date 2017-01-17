# We'll create a file called .built after building
if [ ! -f .build.started ]; then (
    # Write the current date to a file named .build
    (date > .build.started) &&
    
    # Install the dev environment
    # This will include webpack, etc, which we need to build.
    (NODE_ENV=development npm install > .build.npm.log) &&

    # Build frontend JS, then put the current date in a
    # file called '.built'.    
    (npm run build > .build.log) &&

    # Mark the end of the build. This is not used, but
    # you can use it to quickly check the status of the dyno,
    # by running:
    #
    #    heroku run cat .build.completed
    #
    (date > .build.completed)
) &
# The '&' runs the whole last block of shell commands in the
# background.
#
# This keeps our server startup time low, at the cost of failing
# any requests that arrive in the few seconds before bundle.js
# is built.
#
# In a real app, we would have a tool that cut a branch, built it,
# and deployed with our bundle.js already present. This works well
# enough for our purposes.
fi