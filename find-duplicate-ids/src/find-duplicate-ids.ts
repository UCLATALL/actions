import * as glob from '@actions/glob'
import {document_from_md} from './document-from-md'

type IDMap = Record<string, ID[]>
type ID = {name: string; file: string}

export async function find_duplicate_ids(
  include: string[],
  follow_symbolic_links = true
) {
  const glob_options = {followSymbolicLinks: follow_symbolic_links}
  const globber = await glob.create(include.join('\n'), glob_options)

  const ids: IDMap = {}
  const duplicates: IDMap = {}

  for await (const file of globber.globGenerator()) {
    const document = await document_from_md(file)
    document.querySelectorAll('*[id]').forEach(element => {
      const id: ID = {name: element.id, file: file}

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
