import * as path from 'path'
import {JSDOM} from 'jsdom'
import {expect, it} from '@jest/globals'
import {document_from_md, build_parser, render_html} from './document-from-md'

const fixtures_dir = path.join(__dirname, '..', 'test/fixtures')

const test_file = path.join(fixtures_dir, 'valid/page-1.md')
const document_promise = document_from_md(test_file)

it('properly converts code fences with attributes', async () => {
  const document = await document_promise

  let element = document.getElementById('ch2-1')
  expect(element?.tagName).toBe('CODE')

  element = document.getElementById('ch2-2')
  expect(element?.tagName).toBe('CODE')
})

it('properly renders iframes on the page', async () => {
  const document = await document_promise

  let element = document.getElementById('Pulse2')
  expect(element?.tagName).toBe('IFRAME')

  element = document.getElementById('Ch2_Starting_1_r3.0')
  expect(element?.tagName).toBe('IFRAME')
})

it('can handle anything from markdown, to partial HTML, to a full HTML page', async () => {
  const partial_document = await document_from_md(
    path.join(fixtures_dir, 'contains-html/partial-html.html')
  )

  const full_document = await document_from_md(
    path.join(fixtures_dir, 'contains-html/full-html.html')
  )

  const squish = (doc: Document) => doc.documentElement.outerHTML.replace(/>\s+</g, '><')
  expect(squish(partial_document)).toBe(squish(full_document))
})

it('works with indented HTML (full file indented by 4 spaces, not read as code block)', async () => {
  const regular = path.join(fixtures_dir, 'contains-html/partial-html.html')
  const indented = path.join(fixtures_dir, 'contains-html/indented-html.html')
  expect(await render_html(indented)).toBe(await render_html(regular))
})
