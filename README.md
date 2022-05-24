# UCLATALL Actions

This repository houses the GitHub actions used by UCLATALL. These actions are used to facilitate editing and maintaining the books in the *Better Book* project. Read more at <https://coursekata.org>

## Developers / Maintenance

Husky is installed in this project to help make sure that the action packages are appropriately built before committing. This is a small project, so the Husky setup isn't automated --- if you have a JS/TS action that needs to be packaged before committing, the easiest way to set that up is to 

1. Run `npx husky install`
2. Add a script to the action's `package.json`. It should compile, lint, test, package, etc. your code.
3. Open this directory's `.husky/pre-commit` and add a new line calling your script (make sure to use the `--prefix` argument)
