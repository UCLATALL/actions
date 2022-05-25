import * as fs from 'fs/promises'
import dedent from 'dedent'
import {JSDOM} from 'jsdom'
import MarkdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'

export function build_parser() {
  const parser = new MarkdownIt({html: true})
  parser.use(markdownItAttrs)
  return parser
}

export async function render_html(markdown_file: string): Promise<string> {
  const parser = build_parser()
  return fs
    .readFile(markdown_file, 'utf-8')
    .then(contents => dedent(contents))
    .then(contents => parser.render(contents))
}

export async function document_from_md(file: string): Promise<Document> {
  const dom = await render_html(file).then(html => new JSDOM(html))
  return dom.window.document
}
