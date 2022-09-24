import {expect, it} from '@jest/globals'
import * as child_process from 'child_process'
import * as path from 'path'

function relativize_paths(output: string): string {
  const matcher = new RegExp(process.cwd(), 'g')
  return output.replace(matcher, '.')
}

it('will work on GitHub Actions (valid)', () => {
  // setup actions env like it will be on GitHub
  process.env['INPUT_INCLUDE'] = './test/fixtures/valid/*'
  process.env['INPUT_FOLLOW-SYMBOLIC-LINKS'] = 'true'
  process.env['INPUT_RELEASE-NAME'] = 'some-release'
  process.env['INPUT_RELEASE-DATE'] = 'January 1, 2022'

  // get info for executing with node
  const node = process.execPath
  const run_path = path.join(__dirname, '..', 'lib', 'main.js')
  const options: child_process.ExecFileSyncOptions = {
    env: process.env,
  }

  // execute with appropriate env
  const output = child_process.execFileSync(node, [run_path], options).toString()
  expect(relativize_paths(output)).toMatchInlineSnapshot(`
    "::debug::followSymbolicLinks 'true'
    ::debug::matchDirectories 'false'
    ::debug::followSymbolicLinks 'true'
    ::debug::implicitDescendants 'true'
    ::debug::matchDirectories 'false'
    ::debug::omitBrokenSymbolicLinks 'true'
    ::debug::Search path './test/fixtures/valid'
    
    ::set-output name=errors::[]
    "
  `)
})

it('will work on GitHub Actions (invalid)', () => {
  // setup actions env like it will be on GitHub
  process.env['INPUT_INCLUDE'] = './test/fixtures/missing-name/*'
  process.env['INPUT_FOLLOW-SYMBOLIC-LINKS'] = 'true'
  process.env['INPUT_RELEASE-NAME'] = 'some-release'
  process.env['INPUT_RELEASE-DATE'] = 'January 1, 2022'

  // get info for executing with node
  const node = process.execPath
  const run_path = path.join(__dirname, '..', 'lib', 'main.js')
  const options: child_process.ExecFileSyncOptions = {
    env: process.env,
  }

  // execute with appropriate env
  try {
    child_process.execFileSync(node, [run_path], options).toString()
  } catch (error) {
    type ExecError = Error & {
      status: number
      stdout: Buffer
      stderr: Buffer
      message: Buffer
    }

    expect((error as ExecError).stdout.toString()).toMatchInlineSnapshot(`
      "::debug::followSymbolicLinks 'true'
      ::debug::matchDirectories 'false'
      ::debug::followSymbolicLinks 'true'
      ::debug::implicitDescendants 'true'
      ::debug::matchDirectories 'false'
      ::debug::omitBrokenSymbolicLinks 'true'
      ::debug::Search path '/Users/adamblake/work/actions/validate-book-yaml/test/fixtures/missing-name'

      ::set-output name=errors::[{"description":"Missing required property 'name'","location":"/Users/adamblake/work/actions/validate-book-yaml/test/fixtures/missing-name/missing-name.book.yml","suggestion":""}]
      ::error::Some errors were found when validating the book configuration files%0A%0ADescription: Missing required property 'name'%0ALocation: /Users/adamblake/work/actions/validate-book-yaml/test/fixtures/missing-name/missing-name.book.yml
      "
    `)
  }
})
