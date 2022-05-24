import {document_from_md} from './document-from-md'
import * as path from 'path'
import {expect, it} from '@jest/globals'

const test_file = path.join(__dirname, '..', 'test/fixtures/valid/page-1.md')
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
