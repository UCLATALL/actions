import {expect, it} from '@jest/globals'
import {bullet_list, format_duplicate_message} from './formatting'

it('should output the header above an indented, bulletted list', () => {
  expect(bullet_list('hello hello', ['a', 'b', 'c'])).toBe(
    'hello hello\n  - a\n  - b\n  - c'
  )
})

it('supports nesting bulleted lists', () => {
  const nested = bullet_list('top-level', [
    bullet_list('next-level', ['c', 'd'], 2),
    bullet_list('next-level', ['e', 'f'], 2),
  ])
  expect(nested).toBe(
    'top-level\n' +
      '  - next-level\n    - c\n    - d\n' +
      '  - next-level\n    - e\n    - f'
  )
})

it('formats duplicate info in nicely nested lists', () => {
  const duplicates = {
    a: [
      {file: 'page-1.md', name: 'a'},
      {file: 'page-2.md', name: 'a'},
    ],
  }
  expect(format_duplicate_message(duplicates)).toBe(
    'Duplicate IDs found. Here are the IDs and their locations:\n' +
      '  - a\n' +
      '      page-1.md\n' +
      '      page-2.md'
  )
})
