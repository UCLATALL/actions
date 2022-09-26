// this module is just for running the action on GitHub actions
// keep the actual logic separated into other files to make them easier to test

import * as core from '@actions/core'
import {IConfigError} from './errors'
import {validate_repo} from './validate-repo'
import {relativize_paths} from './formatting'

async function run() {
  try {
    const include = core.getMultilineInput('include')
    const follow_symbolic_links = core.getBooleanInput('follow-symbolic-links')
    const auto_update = core.getBooleanInput('auto-update')
    core.debug(`include '${include}'`)
    core.debug(`auto-update '${auto_update}'`)

    if (!(Array.isArray(include) && include.every(glob => typeof glob === 'string'))) {
      const message =
        'Argument to `include` must be a string of globs (with newline characters separating globs).'
      core.setFailed(message)
      return
    }

    const validation_errors = await validate_repo(
      include,
      follow_symbolic_links,
      auto_update
    )
    core.setOutput('errors', validation_errors)
    if (validation_errors.length > 0) {
      const message = relativize_paths(format_error_message(validation_errors))
      core.setFailed(message)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function format_error_message(validation_errors: IConfigError[]) {
  return [
    'Some errors were found when validating the book configuration files',
    ...validation_errors.map(error => {
      const messages = [
        `Description: ${error.description}`,
        `Location: ${error.location}`,
      ]
      if (error.suggestion !== '') {
        messages.push(`Suggestion: ${error.suggestion}`)
      }
      return messages.join('\n')
    }),
  ].join('\n\n')
}

run()
