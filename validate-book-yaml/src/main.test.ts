import {expect, it, jest} from '@jest/globals'
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'
import {relativize_paths} from './formatting'
import {copy_dir_sync} from './utils'

const temp_dir_prefix = 'test/fixtures/temp--'

function snapshotify(snapshot: string): string {
  return relativize_paths(
    snapshot
      .replace(/::debug::release date:.+?\n/g, '::debug::release date: MONTH DAY, YEAR\n')
      .replace(/test\/fixtures\/temp--\w{6}/g, `${temp_dir_prefix}(rand. string)`)
  )
}

it('will work on GitHub Actions (valid)', () => {
  // copy test fixtures so that they don't get overwritten
  const temp_dir = fs.mkdtempSync(temp_dir_prefix)
  const glob = path.join(temp_dir, '*')
  copy_dir_sync('test/fixtures/valid', temp_dir, true)

  // setup actions env like it will be on GitHub
  process.env['GITHUB_REF'] = 'refs/heads/release/v1.0'
  process.env['INPUT_INCLUDE'] = glob
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
  expect(snapshotify(output)).toMatchInlineSnapshot(`
    "::debug::include 'test/fixtures/temp--(rand. string)/*'
    ::debug::auto-update 'true'
    ::debug::release-prefix 'release/'
    ::debug::followSymbolicLinks 'true'
    ::debug::matchDirectories 'false'
    ::debug::followSymbolicLinks 'true'
    ::debug::implicitDescendants 'true'
    ::debug::matchDirectories 'false'
    ::debug::omitBrokenSymbolicLinks 'true'
    ::debug::Search path './test/fixtures/temp--(rand. string)'
    ::debug::validating './test/fixtures/temp--(rand. string)/ABC_college.book.yml'
    ::debug::auto-updating release information
    ::debug::release name: '1.0'
    ::debug::release date: MONTH DAY, YEAR
    ::debug::writing updated config to './test/fixtures/temp--(rand. string)/ABC_college.book.yml'
    ::debug::validating './test/fixtures/temp--(rand. string)/ABC_hs.book.yml'
    ::debug::auto-updating release information
    ::debug::release name: '1.0'
    ::debug::release date: MONTH DAY, YEAR
    ::debug::writing updated config to './test/fixtures/temp--(rand. string)/ABC_hs.book.yml'
    ::debug::validating './test/fixtures/temp--(rand. string)/no-book-variables.book.yml'
    ::debug::auto-updating release information
    ::debug::release name: '1.0'
    ::debug::release date: MONTH DAY, YEAR
    ::debug::writing updated config to './test/fixtures/temp--(rand. string)/no-book-variables.book.yml'
    ::debug::checking unique key across configs: 'name'
    ::debug::checking unique key across configs: 'sortOrder'

    ::set-output name=errors::[]
    "
  `)

  fs.rmSync(temp_dir, {recursive: true, force: true})
})

it('will work on GitHub Actions (invalid)', () => {
  // copy test fixtures so that they don't get overwritten
  const temp_dir = fs.mkdtempSync(temp_dir_prefix)
  const glob = path.join(temp_dir, '*')
  copy_dir_sync('test/fixtures/missing-name', temp_dir, true)

  // setup actions env like it will be on GitHub
  process.env['GITHUB_REF'] = 'refs/heads/release/v1.0'
  process.env['INPUT_INCLUDE'] = glob
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
    expect(snapshotify(output)).toMatchInlineSnapshot(`
      "::debug::include 'test/fixtures/temp--(rand. string)/*'
      ::debug::auto-update 'true'
      ::debug::release-prefix 'release/'
      ::debug::followSymbolicLinks 'true'
      ::debug::matchDirectories 'false'
      ::debug::followSymbolicLinks 'true'
      ::debug::implicitDescendants 'true'
      ::debug::matchDirectories 'false'
      ::debug::omitBrokenSymbolicLinks 'true'
      ::debug::Search path './test/fixtures/temp--(rand. string)'
      ::debug::validating './test/fixtures/temp--(rand. string)/missing-name.book.yml'
      ::warning::skipping auto-update: there were validation errors
      ::debug::checking unique key across configs: 'name'
      ::debug::checking unique key across configs: 'sortOrder'

      ::set-output name=errors::[{"description":"Missing required property 'name'","location":"./test/fixtures/temp--(rand. string)/missing-name.book.yml","suggestion":""}]
      ::error::Some errors were found when validating the book configuration files%0A%0ADescription: Missing required property 'name'%0ALocation: ./test/fixtures/temp--(rand. string)/missing-name.book.yml
      "
    `)
  }

  fs.rmSync(temp_dir, {recursive: true, force: true})
})
