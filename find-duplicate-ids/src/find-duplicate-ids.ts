import * as path from 'path'
import * as core from '@actions/core'
import * as glob from '@actions/glob'
import {document_from_md} from './document-from-md'
import {bullet_list} from './formatting'

export type IDMap = Record<string, ID[]>
type ID = {name: string; file: string}

export async function find_duplicate_ids(
  include: string[],
  follow_symbolic_links = true
) {
  const globber = await glob.create(include.join('\n'), {
    followSymbolicLinks: follow_symbolic_links,
    matchDirectories: false,
  })

  const ids: IDMap = {}
  const duplicates: IDMap = {}

  for await (const file of globber.globGenerator()) {
    if (!['.html', '.md'].includes(path.parse(file).ext.toLowerCase())) {
      continue
    }

    const document = await document_from_md(file)
    document.querySelectorAll('*[id]').forEach(element => {
      if ((element as HTMLElement).dataset.type == 'vimeo') {
        return
      }

      const id: ID = {name: element.id, file: file.replace(process.cwd(), '.')}

      if (id.name in ids) {
        ids[id.name].push(id)
        duplicates[id.name] = ids[id.name]
      } else {
        ids[id.name] = [id]
      }
    })
  }

  return duplicates
}
