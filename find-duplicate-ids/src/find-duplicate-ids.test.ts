import {expect, it} from '@jest/globals'
import {find_duplicate_ids} from './find-duplicate-ids'

it('finds no duplicates when a file has no duplicates', async () => {
  const duplicates = await find_duplicate_ids(['./test/fixtures/valid/*'])
  expect(duplicates).toEqual({})
})

it('ignores non-markdown files', async () => {
  const duplicates = await find_duplicate_ids(['./test/fixtures/no-markdown'])
  expect(duplicates).toEqual({})
})

it('tolerates HTML and partial HTML though', async () => {
  const duplicates = await find_duplicate_ids(['./test/fixtures/contains-html'])
  expect(duplicates).toEqual({
    Pulse2: [
      {file: './test/fixtures/contains-html/full-html.html', name: 'Pulse2'},
      {file: './test/fixtures/contains-html/full-html.html', name: 'Pulse2'},
      {file: './test/fixtures/contains-html/indented-html.html', name: 'Pulse2'},
      {file: './test/fixtures/contains-html/indented-html.html', name: 'Pulse2'},
      {file: './test/fixtures/contains-html/partial-html.html', name: 'Pulse2'},
      {file: './test/fixtures/contains-html/partial-html.html', name: 'Pulse2'},
    ],
  })
})

it('finds duplicated IDs within a page', async () => {
  const expected_ids = (name: string) => [
    {name: name, file: './test/fixtures/repeated-in-page/page-1-doubled.md'},
    {name: name, file: './test/fixtures/repeated-in-page/page-1-doubled.md'},
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
    {name: name, file: './test/fixtures/repeated-across-pages/page-1-copy.md'},
    {name: name, file: './test/fixtures/repeated-across-pages/page-1.md'},
  ]

  const duplicates = await find_duplicate_ids(['./test/fixtures/repeated-across-pages/*'])
  expect(duplicates).toMatchObject({
    Pulse2: expected_ids('Pulse2'),
    'ch2-1': expected_ids('ch2-1'),
    'Ch2_Starting_1_r3.0': expected_ids('Ch2_Starting_1_r3.0'),
    'ch2-2': expected_ids('ch2-2'),
  })
})
