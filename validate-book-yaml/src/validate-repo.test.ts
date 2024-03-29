import {expect, jest, it, describe} from '@jest/globals'
import fs, {lstatSync} from 'fs'
import {DateTime} from 'luxon'
import path from 'path'
import YAML from 'yaml'
import {BookConfig} from './schema'
import {validate_repo} from './validate-repo'
import {copy_dir_sync, get_mtimes_sync} from './utils'

const test_glob = (pattern: string): string => path.join('./test/fixtures', pattern, '*')

it('has no problems with valid configs', async () => {
  const errors = await validate_repo([test_glob('valid')])
  expect(errors).toHaveLength(0)
})

it('requires at least one book config', async () => {
  const errors = await validate_repo([test_glob('no-config')])
  expect(errors[0]).toMatchObject({
    description: expect.stringMatching(/No config files found./),
  })
})

it('requires all configs to be valid YAML', async () => {
  const errors = await validate_repo([test_glob('invalid-yaml')])
  expect(errors[0]).toMatchObject({
    description: expect.stringMatching(/Missing closing "quote/),
  })
})

it('requires all configs to have `name` keys', async () => {
  const errors = await validate_repo([test_glob('missing-name')])
  expect(errors[0]).toMatchObject({
    description: expect.stringMatching(/Missing required property 'name'/),
  })
})

it('requires all configs to have unique `names`', async () => {
  const errors = await validate_repo([test_glob('repeated-name')])
  expect(errors[0]).toMatchObject({
    description: expect.stringMatching(/Some books have the same value for 'name'/),
  })
})

it('requires all configs to have `sortOrder` keys', async () => {
  const errors = await validate_repo([test_glob('missing-sortOrder')])
  expect(errors[0]).toMatchObject({
    description: expect.stringMatching(/Missing required property 'sortOrder'/),
  })
})

it('requires all configs to have unique `sortOrder`s', async () => {
  const errors = await validate_repo([test_glob('repeated-sortOrder')])
  expect(errors[0]).toMatchObject({
    description: expect.stringMatching(/Some books have the same value for 'sortOrder'/),
  })
})

it('requires that `sortOrder` be an integer', async () => {
  const errors = await validate_repo([test_glob('non-int-sortOrder')])
  expect(errors[0]).toMatchObject({
    description: expect.stringMatching(/must be integer/),
  })
})

describe('auto-update', () => {
  const release = 'anything'
  const release_date = DateTime.now()
    .setZone('America/Los_Angeles')
    .toLocaleString(DateTime.DATE_FULL)
  const valid_github_ref = `refs/heads/release/${release}`
  const invalid_github_ref = 'refs/pull/35/merge'

  it('does not change files when other validation errors occurred', async () => {
    process.env['GITHUB_REF'] = valid_github_ref

    const temp_dir = 'test/fixtures/temp'
    const glob = path.join(temp_dir, '*')
    copy_dir_sync('test/fixtures/missing-name', temp_dir, true)

    const pre_mtimes = get_mtimes_sync(temp_dir)
    await validate_repo([glob], true, true)
    const post_mtimes = get_mtimes_sync(temp_dir)
    expect(post_mtimes).toStrictEqual(pre_mtimes)

    fs.rmSync(temp_dir, {recursive: true, force: true})
  })

  it("should create or update the release name and date if they don't exist", async () => {
    // use the "valid" dir as it has two files with existing info and one without

    process.env['GITHUB_REF'] = valid_github_ref

    const temp_dir = 'test/fixtures/temp'
    const glob = path.join(temp_dir, '*')
    copy_dir_sync('test/fixtures/valid', temp_dir, true)

    await validate_repo([glob], true, true)
    for (const file of fs.readdirSync(temp_dir)) {
      if (!file.endsWith('.book.yml')) continue
      const full_path = path.join(temp_dir, file)
      const config = YAML.parse(fs.readFileSync(full_path).toString()) as BookConfig
      expect(config.variables?.release).toStrictEqual(release)
      expect(config.variables?.release_date).toStrictEqual(release_date)
    }

    fs.rmSync(temp_dir, {recursive: true, force: true})
  })

  it('fails when the ref is not a release branch push', async () => {
    process.env['GITHUB_REF'] = invalid_github_ref

    const temp_dir = 'test/fixtures/temp'
    const glob = path.join(temp_dir, '*')
    copy_dir_sync('test/fixtures/valid', temp_dir, true)

    const pre_mtimes = get_mtimes_sync(temp_dir)
    await expect(() => validate_repo([glob], true, true)).rejects.toThrow()
    const post_mtimes = get_mtimes_sync(temp_dir)
    expect(post_mtimes).toStrictEqual(pre_mtimes)

    fs.rmSync(temp_dir, {recursive: true, force: true})
  })
})
