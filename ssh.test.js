const VAddy = require('./vaddy')
const { spawn } = require('child_process')
const EventEmitter = require('events')
const os = require('os')
const path = require('path')

jest.mock('child_process')

class MockSpawnChild extends EventEmitter {}

beforeEach(() => {
  process.env.INPUT_USER = 'user'
  process.env.INPUT_AUTH_KEY = 'auth_key'
  process.env.INPUT_FQDN = 'fqdn'
  process.env.INPUT_VERIFICATION_CODE = 'verification_code'
  process.env.INPUT_LOCAL_IP = 'local_ip'
  process.env.INPUT_LOCAL_PORT = 'local_port'
})

afterEach(() => {
  process.env.INPUT_CRAWL_ID = ''
})

describe('ssh tunnel tests', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  test('test spawn ssh ok', async() => {
    const mockSpawnChild = new MockSpawnChild();
    const mockSpawnOk = (command, args) => {
      mockSpawnChild.command = command
      mockSpawnChild.args = args
      setTimeout(() => mockSpawnChild.emit('exit', 0), 200);
      return mockSpawnChild;
    }
    spawn.mockImplementation(mockSpawnOk)
    let vaddy = new VAddy()
    vaddy.remotePort = '9999'
    const sp = await vaddy.spawnSsh()
    expect(sp.command).toBe('ssh')
    expect(sp.args).toMatchObject([
      '-o',
      'UserKnownHostsFile=/dev/null',
      '-o',
      'StrictHostKeyChecking=no',
      '-i',
      path.join(os.homedir(), '/vaddy/ssh/key'),
      '-N',
      '-R',
      '0.0.0.0:9999:local_ip:local_port',
      'portforward@pfd.vaddy.net'
    ])
  })
})
