const VAddy = require('./vaddy')
const nock = require('nock')

test('test new VAddy', async() => {
  let vaddy = new VAddy('user', 'auth_key', 'fqdn', 'verification_code')
  expect(vaddy).not.toBe(undefined)
  expect(vaddy.crawlId).toBe(undefined)
})

test('test new VAddy with crawl_id', async() => {
  let vaddy = new VAddy('user', 'auth_key', 'fqdn', 'verification_code', 'crawl_id')
  expect(vaddy).not.toBe(undefined)
  expect(vaddy.crawlId).toBe('crawl_id')
})

test('test startScan', async() => {
  const scope = nock('https://api.vaddy.net')
    .post('/v1/scan')
    .reply(200, {scan_id: '12345'})
  let vaddy = new VAddy('user', 'auth_key', 'fqdn', 'verification_code')
  const scanId = await vaddy.startScan()
  expect(scanId).toBe('12345')
  scope.done()
})

test('test startScan with crawl_id', async() => {
  const scope = nock('https://api.vaddy.net')
    .post('/v1/scan')
    .reply(200, {scan_id: '12345'})
  let vaddy = new VAddy('user', 'auth_key', 'fqdn', 'verification_code', 'crawl_id')
  const scanId = await vaddy.startScan()
  expect(scanId).toBe('12345')
  scope.done()
})

test('test startScan failed', async() => {
  const scope = nock('https://api.vaddy.net')
    .post('/v1/scan')
    .reply(400, {error_message: 'error!'})
  let vaddy = new VAddy('user', 'auth_key', 'fqdn', 'verification_code')
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
  let vaddy = new VAddy('user', 'auth_key', 'fqdn', 'verification_code')
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
  let vaddy = new VAddy('user', 'auth_key', 'fqdn', 'verification_code')
  await expect(vaddy.getScanResult('12345')).rejects.toThrow('error!')
  scope.done()
})
