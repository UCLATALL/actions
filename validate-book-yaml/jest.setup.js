const core = require('@actions/core')

const info_spy = jest.spyOn(core, 'info')
info_spy.mockImplementation(line => {
  // uncomment to debug
  // process.stderr.write('log:' + line + '\n');
})

const debug_spy = jest.spyOn(core, 'debug')
debug_spy.mockImplementation(msg => {
  // uncomment to see debug output
  // process.stderr.write(msg + '\n');
})
