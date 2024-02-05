import * as child_process from 'child_process'
import * as path from 'path'
import {expect, it} from '@jest/globals'

function relativize_paths(output: string): string {
  const matcher = new RegExp(process.cwd(), 'g')
  return output.replace(matcher, '.')
}

it('will work on GitHub Actions (valid)', () => {
  // setup actions env like it will be on GitHub
  process.env['INPUT_INCLUDE'] = './test/fixtures/valid/*'
  process.env['INPUT_FOLLOW-SYMBOLIC-LINKS'] = 'true'
  process.env['INPUT_ACTION'] = 'warn'

  // get info for executing with node
  const node = process.execPath
  const run_path = path.join(__dirname, '..', 'lib', 'main.js')
  const options: child_process.ExecFileSyncOptions = {
    env: process.env,
  }

  // execute with appropriate env
  const output = child_process.execFileSync(node, [run_path], options).toString()
  expect(relativize_paths(output)).toMatchInlineSnapshot(`
    "::debug::followSymbolicLinks 'true'
    ::debug::matchDirectories 'false'
    ::debug::followSymbolicLinks 'true'
    ::debug::implicitDescendants 'true'
    ::debug::matchDirectories 'false'
    ::debug::omitBrokenSymbolicLinks 'true'
    ::debug::Search path './test/fixtures/valid'
    "
  `)
})

it('will work on GitHub Actions (invalid)', () => {
  // setup actions env like it will be on GitHub
  process.env['INPUT_INCLUDE'] = './test/fixtures/repeated-across-pages/*'
  process.env['INPUT_FOLLOW-SYMBOLIC-LINKS'] = 'true'
  process.env['INPUT_ACTION'] = 'warn'

  // get info for executing with node
  const node = process.execPath
  const run_path = path.join(__dirname, '..', 'lib', 'main.js')
  const options: child_process.ExecFileSyncOptions = {
    env: process.env,
  }

  // execute with appropriate env
  const output = child_process.execFileSync(node, [run_path], options).toString()
  expect(relativize_paths(output)).toMatchInlineSnapshot(`
    "::debug::followSymbolicLinks 'true'
    ::debug::matchDirectories 'false'
    ::debug::followSymbolicLinks 'true'
    ::debug::implicitDescendants 'true'
    ::debug::matchDirectories 'false'
    ::debug::omitBrokenSymbolicLinks 'true'
    ::debug::Search path './test/fixtures/repeated-across-pages'

    ::warning::Duplicate IDs found. Here are the IDs and their locations:%0A  - Pulse2%0A      ./test/fixtures/repeated-across-pages/page-1-copy.md%0A      ./test/fixtures/repeated-across-pages/page-1.md%0A  - ch2-1%0A      ./test/fixtures/repeated-across-pages/page-1-copy.md%0A      ./test/fixtures/repeated-across-pages/page-1.md%0A  - Ch2_Starting_1_r3.0%0A      ./test/fixtures/repeated-across-pages/page-1-copy.md%0A      ./test/fixtures/repeated-across-pages/page-1.md%0A  - ch2-2%0A      ./test/fixtures/repeated-across-pages/page-1-copy.md%0A      ./test/fixtures/repeated-across-pages/page-1.md
    "
  `)
})
