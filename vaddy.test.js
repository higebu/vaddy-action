const VAddy = require('./vaddy')
const io = require('@actions/io')
const nock = require('nock')
const os = require('os')
const path = require('path')
const fs = require('fs')

beforeEach(() => {
  process.env.INPUT_USER = 'user'
  process.env.INPUT_AUTH_KEY = 'auth_key'
  process.env.INPUT_FQDN = 'fqdn'
  process.env.INPUT_VERIFICATION_CODE = 'verification_code'
  process.env.INPUT_PRIVATE_KEY = 'private_key'
  process.env.INPUT_LOCAL_IP = 'local_ip'
  process.env.INPUT_LOCAL_PORT = 'local_port'
})

afterEach(() => {
  process.env.INPUT_CRAWL_ID = ''
})

describe('constructor tests', () => {
  test('test new VAddy', async() => {
    let vaddy = new VAddy()
    vaddy.setSecret()
    expect(vaddy).not.toBe(undefined)
    expect(vaddy.crawlId).toBe('')
  })
  
  test('test new VAddy with crawl_id', async() => {
    process.env.INPUT_CRAWL_ID = 'crawl_id'
    let vaddy = new VAddy()
    vaddy.setSecret()
    expect(vaddy).not.toBe(undefined)
    expect(vaddy.crawlId).toBe('crawl_id')
  })
})

describe('ssh key tests', () => {
  let vaddy = new VAddy()
  let td = ''

  beforeEach(() => {
    td = fs.mkdtempSync(path.join(os.tmpdir(), 'actions-vaddy-test-'))
    vaddy = new VAddy()
    vaddy.sshdir = path.join(td, 'ssh')
    vaddy.keypath = path.join(vaddy.sshdir, 'key')
  })

  afterEach(() => {
    fs.rmdirSync(td, {recursive: true})
  })

  test('test putKey', async() => {
    await vaddy.putKey()
    expect(fs.existsSync(vaddy.keypath)).toBe(true)
  })

  test('test genKey', async() => {
    await vaddy.genKey()
    expect(fs.existsSync(vaddy.sshdir)).toBe(true)
    expect(fs.existsSync(vaddy.keypath)).toBe(true)
  })
})

describe('api tests', () => {
  let vaddy = new VAddy()
  let td = ''

  beforeEach(() => {
    td = fs.mkdtempSync(path.join(os.tmpdir(), 'actions-vaddy-test-'))
    vaddy = new VAddy()
    vaddy.sshdir = path.join(td, 'ssh')
    vaddy.keypath = path.join(vaddy.sshdir, 'key')
  })

  afterEach(() => {
    fs.rmdirSync(td, {recursive: true})
  })

  test('test getPort', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/privnet/port')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
      })
      .reply(200, {port: '9999'})
    const port = await vaddy.getPort()
    expect(port).toBe('9999')
    expect(vaddy.remotePort).toBe('9999')
    scope.done()
  })
  
  test('test getPort failed', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/privnet/port')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
      })
      .reply(400, {error_message: 'error!'})
    await expect(vaddy.getPort()).rejects.toThrow('error!')
    scope.done()
  })
  
  test('test postKey', async() => {
    const scope = nock('https://api.vaddy.net')
      .post('/v1/privnet/sshkey')
      .reply(200, {status: 'ok'})
    await io.mkdirP(vaddy.sshdir)
    fs.writeFileSync(vaddy.keypath+'.pub', 'aaa'+os.EOL, {mode: 0o600, flag: 'a'})
    console.log(vaddy.keypath)
    await vaddy.postKey()
    scope.done()
  })
  
  test('test postKey failed', async() => {
    const scope = nock('https://api.vaddy.net')
      .post('/v1/privnet/sshkey')
      .reply(400, {error_message: 'error!'})
    await io.mkdirP(vaddy.sshdir)
    fs.writeFileSync(vaddy.keypath+'.pub', 'aaa'+os.EOL, {mode: 0o600, flag: 'a'})
    await expect(vaddy.postKey()).rejects.toThrow('error!')
    scope.done()
  })
  
  test('test startScan', async() => {
    const scope = nock('https://api.vaddy.net')
      .post('/v1/scan')
      .reply(200, {scan_id: '12345'})
    const scanId = await vaddy.startScan()
    expect(scanId).toBe('12345')
    scope.done()
  })
  
  test('test startScan with crawl_id', async() => {
    vaddy.crawlId = 'crawl_id'
    const scope = nock('https://api.vaddy.net')
      .post('/v1/scan')
      .reply(200, {scan_id: '12345'})
    const scanId = await vaddy.startScan()
    expect(scanId).toBe('12345')
    scope.done()
  })
  
  test('test startScan failed', async() => {
    const scope = nock('https://api.vaddy.net')
      .post('/v1/scan')
      .reply(400, {error_message: 'error!'})
    await expect(vaddy.startScan()).rejects.toThrow('error!')
    scope.done()
  })
  
  test('test getScanResult', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/scan/result')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
        scan_id: '12345'
      })
      .reply(200, {status: 'scanning'})
    const result = await vaddy.getScanResult('12345')
    expect(result.status).toBe('scanning')
    scope.done()
  })
  
  test('test getScanResult failed', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/scan/result')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
        scan_id: '12345'
      })
      .reply(400, {error_message: 'error!'})
    await expect(vaddy.getScanResult('12345')).rejects.toThrow('error!')
    scope.done()
  })

  test('test waitScan', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/scan/result')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
        scan_id: '12345'
      })
      .reply(200, {status: 'scanning'})
      .get('/v1/scan/result')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
        scan_id: '12345'
      })
      .reply(200, {status: 'finish'})
    const result = await vaddy.waitScan('12345')
    expect(result.status).toBe('finish')
    scope.done()
  })

  test('test runCheck', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/scan/runcheck')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
      })
      .reply(200, {running_process: 0})
    const rp = await vaddy.runCheck()
    expect(rp).toBe(0)
    scope.done()
  })
  
  test('test runCheck failed', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/scan/runcheck')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
      })
      .reply(400, {error_message: 'error!'})
    await expect(vaddy.runCheck()).rejects.toThrow('error!')
    scope.done()
  })

  test('test waitRunningProcess 0', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/scan/runcheck')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
      })
      .reply(200, {running_process: 0})
    const rp = await vaddy.waitRunningProcess(1)
    expect(rp).toBe(0)
    scope.done()
  })

  test('test waitRunningProcess 1', async() => {
    const scope = nock('https://api.vaddy.net')
      .get('/v1/scan/runcheck')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
      })
      .reply(200, {running_process: 1})
      .get('/v1/scan/runcheck')
      .query({
        user: 'user',
        auth_key: 'auth_key',
        fqdn: 'fqdn',
        verification_code: 'verification_code',
      })
      .reply(200, {running_process: 1})
    const rp = await vaddy.waitRunningProcess(1)
    expect(rp).toBe(1)
    scope.done()
  })
})
