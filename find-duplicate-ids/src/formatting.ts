import {IDMap} from './find-duplicate-ids'

export function bullet_list(
  message: string,
  bullets: string[],
  indent_level = 1,
  bullet_char = '-'
): string {
  const indent = '  '.repeat(indent_level)
  const bullet_strings = bullets.map(x => `${indent}${bullet_char} ${x}`)
  return `${message}\n${bullet_strings.join('\n')}`
}

export function format_duplicate_message(duplicates: IDMap): string {
  const header = 'Duplicate IDs found. Here are the IDs and their locations:'
  const bullets = Object.keys(duplicates).map(id => {
    const locations = duplicates[id].map(x => x.file)
    return bullet_list(id, locations, 2, ' ')
  })
  return bullet_list(header, bullets)
}
