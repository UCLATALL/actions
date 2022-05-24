import {readFile} from 'fs/promises'
import {JSDOM} from 'jsdom'
import MarkdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'

const MD = new MarkdownIt({html: true})
MD.use(markdownItAttrs)

export async function document_from_md(file: string): Promise<Document> {
  const dom = await readFile(file, 'utf-8')
    .then(contents => MD.render(contents))
    .then(html => new JSDOM(html))

  return dom.window.document
}
