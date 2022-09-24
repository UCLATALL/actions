import {expect, jest, it, describe} from '@jest/globals'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import {BookConfig} from './schema'
import {validate_repo} from './validate-repo'

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
  const release_date = new Date('2022-01-01T00:00:00.000-08:00')
  const release_date_readable = 'January 1, 2022'

  it('does not change files when other validation errors occurred', async () => {
    const write_spy = jest.spyOn(fs, 'writeFileSync')
    write_spy.mockImplementation((file, data) => {})
    await validate_repo([test_glob('missing-name')], true, release, release_date)
    expect(write_spy).not.toHaveBeenCalled()
  })

  it("should create the release name and date if they don't exist", async () => {
    const write_spy = jest.spyOn(fs, 'writeFileSync')
    write_spy.mockImplementation((file, data) => {
      const config = YAML.parse(data as string) as BookConfig
      expect(config.variables?.release).toBe(release)
      expect(config.variables?.release_date).toBe(release_date_readable)
    })
    await validate_repo([test_glob('valid')], true, release, release_date)
  })

  it('should overwrite the release name and date if they exist', async () => {
    const write_spy = jest.spyOn(fs, 'writeFileSync')
    write_spy.mockImplementation((file, data) => {
      const config = YAML.parse(data as string) as BookConfig
      expect(config.variables?.release).toBe(release)
      expect(config.variables?.release_date).toBe(release_date_readable)
    })
    await validate_repo([test_glob('valid')], true, release, release_date)
  })

  // it('overwrites config when the file is valid and has been updated', async () => {
  //   const write_spy = jest.spyOn(fs, 'writeFileSync')
  //   write_spy.mockImplementation((file, data) => {
  //     // do nothing
  //   })

  //   const bump_spy = jest.spyOn(bump, 'bump_version')
  //   bump_spy.mockReturnValue('mocked return' as unknown as BookConfig)

  //   const bump_args = {
  //     release: 'test',
  //     release_date: new Date(),
  //   }

  //   await validate_repo([test_glob('valid')], true, bump_args)
  //   expect(bump_spy).toHaveBeenCalledWith(
  //     expect.anything(),
  //     bump_args.release,
  //     bump_args.release_date
  //   )
  //   expect(write_spy).toHaveBeenCalledWith(
  //     expect.stringMatching(/./),
  //     expect.stringMatching(/mocked return/)
  //   )
  // })
})
