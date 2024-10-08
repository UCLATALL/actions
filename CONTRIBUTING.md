## Developers / Maintenance

### Adding an action

All of the actions are subdirectories of this project (e.g. `find-duplicate-ids`). Additionally, they all have GitHub Actions workflows to test them in this repository. When creating a new action, make sure to do all of the following:

1. Create a subdirectory in this repo

2. Create the action

   1. Make sure to fully document the action in the README, and link it with a short description in the [**About these actions**](#about-these-actions) area above
   2. Copy the LICENSE in from the main directory
   3. Make sure to write tests for any code
   4. Make sure to document descriptions, inputs, functions, etc.
   5. If it is a Javascript or Typescript action, make sure it uses [`@vercell/ncc`](https://www.npmjs.com/package/@vercel/ncc) in a script called `package` in `package.json`

3. Add `steps` to the `check-dist` and `build-test` actions (and note that these jobs run using Node 16)

   1. Add a step (you can copy and paste a previous step) to `.github/workflows/check-dist.yml`. This will make sure that the action has been packaged for its most recent commit
   2. Add one step (you can copy and paste a previous step) to the `build` job in `.github/workflows/build.yml`
   3. Add add as many steps as needed to test your code in the `test` job in the same file -- if more than one step make sure to indicate the action in each step's `name`

4. Setup [Husky](https://typicode.github.io/husky/) to make sure everything is packaged and tested on every commit
   1. Run `npx husky install`
   2. Add a script to the action's `package.json`. It should compile, lint, test, package, etc. your code.
   3. Open this directory's `.husky/pre-commit` and add a new line calling your script (make sure to use the `--prefix` argument)
