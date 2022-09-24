import * as glob from '@actions/glob'
import Ajv from 'ajv'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import {
  IConfigError,
  ParseError,
  RequiredUniqueError,
  MissingConfigError,
  ValidationError,
} from './errors'
import {book_schema, BookConfig} from './schema'

export async function validate_repo(
  include: string[],
  follow_symbolic_links = true,
  release_name?: string,
  release_date?: Date
): Promise<IConfigError[]> {
  const ajv = new Ajv({allowUnionTypes: true})
  const validate = ajv.compile(book_schema)

  const globber = await glob.create(include.join('\n'), {
    followSymbolicLinks: follow_symbolic_links,
    matchDirectories: false,
  })

  let file_count = 0
  const errors: IConfigError[] = []
  const configs: BookConfig[] = []
  const unique_trackers: Record<string, Record<string, string[]>> = {
    name: {},
    sortOrder: {},
  }

  for await (const file of globber.globGenerator()) {
    if (!path.basename(file).endsWith('.book.yml')) {
      continue
    }

    file_count++
    const yaml = fs.readFileSync(file, 'utf-8')
    let config: BookConfig
    let was_error = false

    try {
      config = YAML.parse(yaml)
      configs.push(config)
    } catch (err) {
      errors.push(new ParseError(file, err as YAML.YAMLParseError))
      was_error = true
      continue
    }

    validate(config)
    validate.errors?.forEach(error => {
      errors.push(new ValidationError(file, error))
      was_error = true
    })

    // track values that should be unique across configs
    if (!validate.errors) {
      for (const tracker_name in unique_trackers) {
        const tracker = unique_trackers[tracker_name]
        const value = config[tracker_name as 'name' | 'sortOrder'].toString()
        if (!tracker[value]) tracker[value] = []
        tracker[value].push(file)
      }
    }

    // auto-update release and date
    if (!was_error && (release_date || release_name)) {
      if (!config.variables) config.variables = {}
      if (release_name) config.variables.release = release_name
      if (release_date)
        config.variables.release_date = release_date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      fs.writeFileSync(file, YAML.stringify(config))
    }
  }

  // validate unique keys
  for (const tracker_name in unique_trackers) {
    const tracker = unique_trackers[tracker_name]
    for (const value in tracker) {
      const files = tracker[value]
      if (files.length > 1) {
        errors.push(new RequiredUniqueError(files, tracker_name, value))
      }
    }
  }

  // no configs
  if (file_count === 0) {
    errors.push(new MissingConfigError(globber.getSearchPaths()))
  }

  return errors
}
