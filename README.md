# Embed
Version 2 of the Ada embed script.

Embed provides the same functionality as the original Chaperone, but with modern development tools to increase reliability, as well reduce development time.

Some of these tools include:

[PreactJS](https://preactjs.com/): A fast 3kB alternative to React with a stripped down API.

[Jest](https://jestjs.io/): For unit testing.

[TypeScript](https://www.typescriptlang.org/): Static typing, in lieu of `propTypes` (which the current version of Preact does not currently support).

[TSLint](https://palantir.github.io/tslint/): Linter for TypeScript.

[Sass-Lint](https://github.com/sasstools/sass-lint): Linter for `sass` and `scss`.


Webpack is also used under the hood and can be modified via the `preact.config.js` file.

## Setup
To get started, simply run `yarn && yarn start`. This will start a local development server at `http://localhost:8080/`. To make use of `tslint` and `sasslint`, you will need to install the `TypeScript TSLint Plugin` and `Sass Lint` extensions in the text editor of your choice.

### Testing ###
To test changes for this repo, run this command locally `yarn deploy-test`. This pushes local changes to a hosted staging site with the current git commit hash

An example of the link: `https://embed-testing.svc.ada.support/<1st-10-digits-of-commit-hash>.html`. (Note: will overwrite any previous deploys with the same git commit hash).

The url for this testing page is printed out on the console after a successful compilation step.

To point the staged embed to a specific bot add the following to the `<script>` tag in `index.ejs`:

```
data-handle="<bot name>"
data-domain="<Ada domain ie. ada-dev or ada-stage>"
```

This link should be viewed on other devices to confirm correctness of all changes before attempting to merge into `beta`.

The testing page is password protected, auth credentials can be found on this [Notion page here](https://www.notion.so/adasupport/Test-page-Credentials-e3979427fca64bcd83232da3159768f5)

## Beta branch and Deployment ###
The `beta` branch is set as the base branch for this repo. All PRs should be merged into the `beta` branch 1st, this deploys a beta embed script for testing `embed.beta.js`  at `https://static.ada.support/`.

After robust testing, only the `beta` branch should be merged directly into `master` with admin approval

Embed is setup to deploy automatically on merge to the `master` branch, using CircleCI, generating 2 Embed scripts `embed.js` and `embed.[git-hash 1st 8 chars].js` at `https://static.ada.support/`

## Rollback Instructions ##

To rollback a version of Embed, simply revert the master branch to the last stable commit (will require admin access)

#### To list the commits ####

```git log —oneline```

#### To perform the rollback revert to the desired commit ####

```git revert <commit hash>```

#### If you want to rollback only the most recent commit, you can run ####

```git revert HEAD```

#### Push the changes to master and let CirlceCI handle the deployment ####

```git push```
