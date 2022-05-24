// this module is just for running the action on GitHub actions
// keep the actual logic separated into other files to make them easier to test

import * as core from '@actions/core'
import {find_duplicate_ids} from './find-duplicate-ids'

async function run() {
  try {
    // TODO: do I need to checkout? or should it already be checked out?
    // const github_ref =
    //   process.env.GITHUB_EVENT_NAME === 'pull_request'
    //     ? process.env.GITHUB_HEAD_REF
    //     : process.env.GITHUB_REF_NAME;
    // await exec.exec(`git checkout ${github_ref}`);

    const follow_symbolic_links = core.getBooleanInput('follow-symbolic-links')
    const include = JSON.parse(core.getInput('include'))

    if (!(Array.isArray(include) && include.every(glob => typeof glob === 'string'))) {
      core.setFailed('The `include` parameter must be a JSON-encoded array of strings.')
      return
    }

    // if (include.length === 0) {
    //   core.info('No `input` globs specified --- nothing to do.');
    //   core.setOutput('duplicates', JSON.stringify({}));
    //   return;
    // }

    const duplicates = find_duplicate_ids(include, follow_symbolic_links)
    core.setOutput('duplicates', duplicates)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
