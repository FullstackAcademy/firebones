# Hi, I'm bones

I'm a happy little skeleton. You can clone me to use as a starter on your projects!
I have React, Redux, Sequelize, and Express all just rattling around in here ready
to go.

## I need node >= 6.7.0

If you don't have it, I'll complain and tell you how to install it.

## 1. Make me into something!

Create a git repo however you want to. You can fork me on Github, but you can only do
that once (so weird!). You can also create a Github repo and clone it, or just do
`git init` in an empty directory on your machine.

After you have a repo on your machine:

```
git remote add bones https://github.com/queerviolet/bones.git
git fetch bones
git merge bones/master
```

And then you'll have me! If I change—which I probably will—you can get the most recent
version by doing this again:

```
git fetch bones
git merge bones/master
```

## 2. I need a name.

I don't have a name. I think I used to have one, but it turned to dust right along with my
heart and liver and pituitary gland and all that stuff.

Anyway, I'll need one. Give me a name in `package.json`.

## 3. Start my dusty heart

Short and sweet:

```
npm install
npm run build-watch
npm start
```

`npm start` doesn't build, so watch out for that. The reason it doesn't build is because you
probably want to watch the build and run me in separate terminals. Otherwise, build errors get
all mixed in with HTTP request logging.

## My anatomy

`/app` has the React/Redux setup. `main.jsx` is the entry point.

`/db` has the Sequelize models and database setup. It'll create the database for you if it doesn't exist,
assuming you're using postgres.

`/server` has the Express server and routes. `start.js` is the entry point.

`/bin` has scripts. (Right now it has *one* script that creates a useful symlink.)

## Conventions

I use `require` and `module.exports` in `.js` files.

I use `import` and `export` in `.jsx` files, unless `require` makes for cleaner code.

I use two spaces, no semi-colons, and trailing commas where possible. I'll
have a linter someday soon.

## Deploy to Heroku

1. Set up the Heroku command line tools
2. `heroku login`
3. `npm install -g yarn` if you don't have it.
3. `yarn add libpq pg-native`
4. `touch .profile` and add these lines:
```
NODE_ENV=development yarn
npm rebuild
npm run build
```
5. `heroku create`
6. `git commit -a -m "Set up .profile for heroku."`
7. `git push heroku master`
8. Add postgres: `heroku addons:create heroku-postgresql:hobby-dev`
9. Seed the prod database: `heroku run db/seed`
