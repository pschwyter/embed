# Chaperone2
Version 2 of the Ada embed script.

Chaperone2 provides the same functionality as Chaperone, but with modern development tools to increase reliability, as well reduce development time.

Some of these tools include:

[PreactJS](https://preactjs.com/): A fast 3kB alternative to React with a stripped down API.

[Jest](https://jestjs.io/): For unit testing.

[TypeScript](https://www.typescriptlang.org/): Static typing, in lieu of `propTypes` (which the current version of Preact does not currently support).

[TSLint](https://palantir.github.io/tslint/): Linter for TypeScript.

[Sass-Lint](https://github.com/sasstools/sass-lint): Linter for `sass` and `scss`.


Webpack is also used under the hood and can be modified via the `preact.config.js` file.

## Setup
To get started, simply run `yarn && yarn start`. This will start a local development server at `http://localhost:8080/`. To make use of `tslint` and `sasslint`, you will need to install the `TypeScript TSLint Plugin` and `Sass Lint` extensions in the text editor of your choice.

## Rollback Instructions ##

To rollback a version of chaperone, simply revert the master branch to the last stable commit

#### To list the commits ####

```git log —oneline```

#### To perform the rollback revert to the desired commit ####

```git revert <commit hash>```

#### If you want to rollback only the most recent commit, you can run ####

```git revert HEAD```

#### Push the changes to master and let CirlceCi handle the deployment ####

```git push```