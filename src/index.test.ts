const createPlugin = require('./index') // eslint-disable-line

describe('Github Plugin', () => {
  it('should return a module', () => {
    const options = {
      appId: 'my-app-id',
      privateKey: 'my-priavte-key',
      installationId: 'my-install-id'
    }

    const result = createPlugin(options)
    expect(result).not.toBeUndefined()
    expect(typeof result.additionalPages).toEqual('function')
  })
})
