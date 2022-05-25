// this module is just for running the action on GitHub actions
// keep the actual logic separated into other files to make them easier to test

import * as core from '@actions/core'
import {find_duplicate_ids} from './find-duplicate-ids'
import {format_duplicate_message} from './formatting'

async function run() {
  try {
    const include = core.getMultilineInput('include')
    const follow_symbolic_links = core.getBooleanInput('follow-symbolic-links')
    const action = core.getInput('action').toLowerCase()

    if (!(Array.isArray(include) && include.every(glob => typeof glob === 'string'))) {
      const message =
        'Argument to `include` must be a string of globs (with newline characters separating globs).'
      core.setFailed(message)
      return
    }

    if ('warn' !== action && 'error' !== action) {
      const message = "Argument to `action` must be either 'warn' or 'error'."
      core.setFailed(message)
      return
    }

    const duplicates = await find_duplicate_ids(include, follow_symbolic_links)
    core.setOutput('duplicates', JSON.stringify(duplicates))

    if (Object.keys(duplicates).length > 0) {
      const message = format_duplicate_message(duplicates)
      if (action === 'error') {
        core.setFailed(message)
        return
      } else {
        core.warning(message)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
