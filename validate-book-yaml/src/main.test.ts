import {expect, it, jest} from '@jest/globals'
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'
import {relativize_paths} from './formatting'

it('will work on GitHub Actions (valid)', () => {
  // don't accidentally overwrite test files
  const write_spy = jest.spyOn(fs, 'writeFileSync')
  write_spy.mockImplementation((file, data) => {})

  // setup actions env like it will be on GitHub
  process.env['GITHUB_REF'] = 'refs/heads/release/v1.0'
  process.env['INPUT_INCLUDE'] = './test/fixtures/valid/*'
  process.env['INPUT_FOLLOW-SYMBOLIC-LINKS'] = 'true'
  process.env['INPUT_AUTO-UPDATE'] = 'true'
  process.env['INPUT_RELEASE-PREFIX'] = 'release/'

  // get info for executing with node
  const node = process.execPath
  const run_path = path.join(__dirname, '..', 'lib', 'main.js')
  const options: child_process.ExecFileSyncOptions = {
    env: process.env,
  }

  // execute with appropriate env
  const output = child_process.execFileSync(node, [run_path], options).toString()
  expect(relativize_paths(output)).toMatchInlineSnapshot(`
    "::debug::include './test/fixtures/valid/*'
    ::debug::auto-update 'true'
    ::debug::release-prefix 'release/'
    ::debug::followSymbolicLinks 'true'
    ::debug::matchDirectories 'false'
    ::debug::followSymbolicLinks 'true'
    ::debug::implicitDescendants 'true'
    ::debug::matchDirectories 'false'
    ::debug::omitBrokenSymbolicLinks 'true'
    ::debug::Search path './test/fixtures/valid'
    ::debug::validating './test/fixtures/valid/ABC_college.book.yml'
    ::debug::auto-updating release information
    ::debug::release name: '1.0'
    ::debug::release date: 'September 26, 2022'
    ::debug::validating './test/fixtures/valid/ABC_hs.book.yml'
    ::debug::auto-updating release information
    ::debug::release name: '1.0'
    ::debug::release date: 'September 26, 2022'
    ::debug::checking unique key across configs: 'name'
    ::debug::checking unique key across configs: 'sortOrder'

    ::set-output name=errors::[]
    "
  `)
})

it('will work on GitHub Actions (invalid)', () => {
  // don't accidentally overwrite test files
  const write_spy = jest.spyOn(fs, 'writeFileSync')
  write_spy.mockImplementation((file, data) => {})

  // setup actions env like it will be on GitHub
  process.env['INPUT_INCLUDE'] = './test/fixtures/missing-name/*'
  process.env['INPUT_FOLLOW-SYMBOLIC-LINKS'] = 'true'
  process.env['INPUT_AUTO-UPDATE'] = 'true'
  process.env['INPUT_RELEASE-PREFIX'] = 'release/'

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

    const output = (error as ExecError).stdout.toString()
    expect(relativize_paths(output)).toMatchInlineSnapshot(`
      "::debug::include './test/fixtures/missing-name/*'
      ::debug::auto-update 'true'
      ::debug::release-prefix 'release/'
      ::debug::followSymbolicLinks 'true'
      ::debug::matchDirectories 'false'
      ::debug::followSymbolicLinks 'true'
      ::debug::implicitDescendants 'true'
      ::debug::matchDirectories 'false'
      ::debug::omitBrokenSymbolicLinks 'true'
      ::debug::Search path './test/fixtures/missing-name'
      ::debug::validating './test/fixtures/missing-name/missing-name.book.yml'
      ::warning::skipping auto-update: there were validation errors
      ::debug::checking unique key across configs: 'name'
      ::debug::checking unique key across configs: 'sortOrder'

      ::set-output name=errors::[{"description":"Missing required property 'name'","location":"./test/fixtures/missing-name/missing-name.book.yml","suggestion":""}]
      ::error::Some errors were found when validating the book configuration files%0A%0ADescription: Missing required property 'name'%0ALocation: ./test/fixtures/missing-name/missing-name.book.yml
      "
    `)
  }
})
