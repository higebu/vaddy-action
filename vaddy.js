const core = require('@actions/core')
const io = require('@actions/io')
const httpm = require('@actions/http-client')
const querystring = require('querystring');
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process');

const endpoint = 'https://api.vaddy.net'
const api_version_v1 = '/v1'

function sleep(waitSec) {
    return new Promise(function (resolve) {
        setTimeout(function() { resolve() }, waitSec);
    });
} 

class VAddy {
  constructor() {
    this.user = core.getInput('user')
    this.authKey = core.getInput('auth_key')
    this.fqdn = core.getInput('fqdn')
    this.verificationCode = core.getInput('verification_code')
    this.privateKey = core.getInput('private_key')
    this.remotePort = core.getInput('remote_port')
    this.localIP = core.getInput('local_ip')
    this.localPort = core.getInput('local_port')
    this.crawlId = core.getInput('crawl_id')
    this.http = new httpm.HttpClient('actions-vaddy')
    this.setSecret()
    this.sshdir = path.join(os.homedir(), '/vaddy/ssh')
    this.keypath = path.join(this.sshdir, 'key')
  }

  setSecret() {
    core.setSecret('user')
    core.setSecret('auth_key')
    core.setSecret('fqdn')
    core.setSecret('verification_code')
    core.setSecret('private_key')
    core.setSecret('remote_port')
    core.setSecret('local_ip')
    core.setSecret('local_port')
  }

  async putKey() {
    await io.mkdirP(this.sshdir)
    fs.writeFileSync(this.keypath, this.privateKey+os.EOL, {mode: 0o600, flag: 'ax'})
  }

  async spawnSsh() {
    return spawn('ssh', [
      '-o',
      'UserKnownHostsFile=/dev/null',
      '-o',
      'StrictHostKeyChecking=no',
      '-i',
      this.keypath,
      '-N',
      '-R',
      '0.0.0.0:'+this.remotePort+':'+this.localIP+':'+this.localPort,
      'portforward@pfd.vaddy.net',
    ])
  }

  async startScan() {
    let url = new URL(api_version_v1 + '/scan', endpoint)
    let data = {
      'action': 'start',
      'user': this.user,
      'auth_key': this.authKey,
      'fqdn': this.fqdn,
      'verification_code': this.verificationCode,
    }
    if (this.crawlId) {
      data['crawl_id'] = this.crawlId
    }
    const postData = querystring.stringify(data)
    let res = await this.http.post(url.toString(), postData, {
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    let body = await res.readBody()
    let obj = JSON.parse(body)
    if (res.message.statusCode !== 200) {
      throw new Error(obj.error_message)
    }
    return obj.scan_id
  }

  async getScanResult(scanId) {
    let url = new URL(api_version_v1 + '/scan/result', endpoint)
    url.searchParams.set('user', this.user)
    url.searchParams.set('auth_key', this.authKey)
    url.searchParams.set('fqdn', this.fqdn)
    url.searchParams.set('verification_code', this.verificationCode)
    url.searchParams.set('scan_id', scanId)
    let res = await this.http.get(url.toString())
    let body = await res.readBody()
    let obj = JSON.parse(body)
    if (res.message.statusCode !== 200) {
      throw new Error(obj.error_message)
    }
    return obj
  }

  async waitScan(scanId) {
    let result = await this.getScanResult(scanId)
    while (result.status === 'scanning') {
      await sleep(5)
      result = await this.getScanResult(scanId)
    }
    return result
  }
}

module.exports = VAddy
