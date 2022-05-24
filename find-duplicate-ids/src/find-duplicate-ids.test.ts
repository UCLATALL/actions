import * as process from 'process'
import * as child_process from 'child_process'
import * as path from 'path'
import {expect, it} from '@jest/globals'
import {find_duplicate_ids} from './find-duplicate-ids'

const fixtures_dir = path.join(__dirname, '..', 'test/fixtures')

it('finds no duplicates when a file has no duplicates', async () => {
  const duplicates = await find_duplicate_ids(['./test/fixtures/valid/*'])
  expect(duplicates).toEqual({})
})

it('finds duplicated IDs within a page', async () => {
  const expected_ids = (name: string) => [
    {name: name, file: path.join(fixtures_dir, 'repeated-in-page/page-1-doubled.md')},
    {name: name, file: path.join(fixtures_dir, 'repeated-in-page/page-1-doubled.md')},
  ]

  const duplicates = await find_duplicate_ids(['./test/fixtures/repeated-in-page/*'])
  expect(duplicates).toMatchObject({
    Pulse2: expected_ids('Pulse2'),
    'ch2-1': expected_ids('ch2-1'),
    'Ch2_Starting_1_r3.0': expected_ids('Ch2_Starting_1_r3.0'),
    'ch2-2': expected_ids('ch2-2'),
  })
})

it('finds duplicated IDs across pages', async () => {
  const expected_ids = (name: string) => [
    {name: name, file: path.join(fixtures_dir, 'repeated-across-pages/page-1-copy.md')},
    {name: name, file: path.join(fixtures_dir, 'repeated-across-pages/page-1.md')},
  ]

  const duplicates = await find_duplicate_ids(['./test/fixtures/repeated-across-pages/*'])
  expect(duplicates).toMatchObject({
    Pulse2: expected_ids('Pulse2'),
    'ch2-1': expected_ids('ch2-1'),
    'Ch2_Starting_1_r3.0': expected_ids('Ch2_Starting_1_r3.0'),
    'ch2-2': expected_ids('ch2-2'),
  })
})

it('will work on GitHub Actions (valid)', () => {
  // setup actions env like it will be on GitHub
  process.env['INPUT_FOLLOW-SYMBOLIC-LINKS'] = 'true'
  process.env['INPUT_INCLUDE'] = '["./test/fixtures/valid/*"]'

  // get info for executing with node
  const node = process.execPath
  const run_path = path.join(__dirname, '..', 'lib', 'main.js')
  const options: child_process.ExecFileSyncOptions = {
    env: process.env,
  }

  // execute with appropriate env
  console.log(child_process.execFileSync(node, [run_path], options).toString())
})
