const VAddy = require('./vaddy')
const core = require('@actions/core')
const io = require('@actions/io')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process');

function sleep(waitSec) {
    return new Promise(function (resolve) {
        setTimeout(function() { resolve() }, waitSec);
    });
} 

async function run() {
  try { 
    const user = core.getInput('user')
    const authKey = core.getInput('auth_key')
    const fqdn = core.getInput('fqdn')
    const verificationCode = core.getInput('verification_code')
    const privateKey = core.getInput('private_key')
    const remotePort = core.getInput('remote_port')
    const localIP = core.getInput('local_ip')
    const localPort = core.getInput('local_port')
    const crawlId = core.getInput('crawl_id')
    core.setSecret('user')
    core.setSecret('auth_key')
    core.setSecret('fqdn')
    core.setSecret('verification_code')
    core.setSecret('private_key')
    core.setSecret('remote_port')
    core.setSecret('local_ip')
    core.setSecret('local_port')

    const homedir = os.homedir()
    const sshdir = path.join(homedir, '/vaddy/ssh')
    const keypath = path.join(sshdir, 'key')
    await io.mkdirP(sshdir)
    fs.writeFileSync(keypath, privateKey+os.EOL, {mode: 0o600, flag: 'ax'})
    const sp = spawn('ssh', [
      '-o',
      'UserKnownHostsFile=/dev/null',
      '-o',
      'StrictHostKeyChecking=no',
      '-i',
      keypath,
      '-N',
      '-R',
      '0.0.0.0:'+remotePort+':'+localIP+':'+localPort,
      'portforward@pfd.vaddy.net',
    ])
    sp.on('error', (err) => {
     console.error(err)
    })

    if (crawlId) {
      core.info('crawl_id: ' + crawlId)
    }
    let vaddy = new VAddy(user, authKey, fqdn, verificationCode, crawlId)
    const scanId = await vaddy.startScan()
    core.info('scan_id: ' + scanId)
    let result = await vaddy.getScanResult(scanId)
    let status = result.status
    while (status === 'scanning') {
      await sleep(5)
      result = await vaddy.getScanResult(scanId)
      status = result.status
    }
    if (status === 'finish') {
      core.info('finish')
      core.info('scan_result_url: ' + result.scan_result_url)
      if (result.alert_count > 0) {
        core.setFailed('alert_count: ' + result.alert_count)
      }
    } else {
      core.setFailed(status)
    }
    sp.kill()
  }
  catch (err) {
    core.setFailed(err.message);
  }
}

run()
