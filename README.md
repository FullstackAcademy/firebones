# Hi, I'm 🔥🔥firebones🔥🔥

I'm a happy little skeleton who is totally on [fire(base)](https://firebase.google.com)!

You can clone me to use as a starter on your projects. I have React and Firebase,
and some examples of how to put them together.

## I need node >= 7.0.0

If you don't have it, I'll complain and tell you how to install it.

## 1. Make me into something!

We recommend that you **clone**, not fork, this repo – unless your intention is
to develop Firebones proper instead of using Firebones as the starting point for your
own application.

Start by doing either of the following:

* Create a GitHub repo and clone it, or
* `git init` in an empty directory on your machine.

After you have a repo on your machine:

```sh
git remote add bones https://github.com/FullstackAcademy/firebones.git
git fetch bones
git merge bones/master
```

And then you'll have me! If I change – which I probably will – you can get the most recent
version by doing this again:

```sh
git fetch bones
git merge bones/master
```

## 2. Install the Firebase command line tools

You'll want this globally:

```sh
npm install -g firebase-tools
```

If you just installed them, you'll need to log in:

```sh
firebase login
```

## 2. Start my dusty heart

Short and sweet:

```sh
npm install
npm run dev
```

The `dev` script runs webpack, `firebase serve`, the linter, and the tests. You can run these
in separate terminals if you prefer:

```sh
npm run build-watch   # webpack
```

```sh
firebase serve        # Serve the app on port 5000
```

```sh
npm run test-watch    # Watch tests
```

```sh
npm run lint-watch    # Watch lint
```

## 3. Tell me about your Firebase

By default, I'm pointed at the firebones firebase. That might be nice for exploring,
but soon you'll want to create your own.

Go to [the Firebase console](https://console.firebase.google.com/) and create
a project. Go to Overview in that project's console, and click "Add Firebase to your web app".

Copy and paste the config from there into [fire/index.js](fire/index.js). You don't have to
copy the call to `initializeApp`, I've already got that.

Then, in your code, you can import firebase like so:

```javascript
import firebase from 'APP/fire'
```

## 4. Deploy

The first time you deploy, you'll need to tell firebase which project to use:

```sh
firebase use --add
```

Then, and every time thereafter, just say,

```sh
firebase deploy
```

And I'll be deployed to Firebase hosting.

## My anatomy

`/app` has the React setup. `main.jsx` is the entry point.

`/fire` has the Firebase config.

`/functions` is where your [cloud functions](https://firebase.google.com/preview/functions/write-firebase-functions) live.

`/demos` has some demos (currently just a little scratchpad).

`/bin` has scripts. (Right now it has *one* script that creates a useful symlink.)

## Conventions

I use `require` and `module.exports` in `.js` files.

I use `import` and `export` in `.jsx` files, unless `require` makes for cleaner code.

I use two spaces, no semi-colons, and generally prefer a less strict version of
[NPM's funny coding style](https://docs.npmjs.com/misc/coding-style). My lint config is
in [eslintrc.js](eslintrc.js).
