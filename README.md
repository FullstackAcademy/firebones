# Hi, I'm bones

I'm a happy little skeleton. You can clone me to use as a starter on your projects!
I have React, Redux, Sequelize, and Express all just rattling around in here ready
to go.

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

## Conventions

I use `require` and `module.exports` in `.js` files.

I use `import` and `export` in `.jsx` files, unless `require` makes for cleaner code.



