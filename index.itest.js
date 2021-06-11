const VAddy = require('./vaddy')
const process = require('process')
const cp = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')

beforeEach(() => {
  const homedir = os.homedir()
  const sshdir = path.join(homedir, '/vaddy/ssh')
  fs.rmdirSync(sshdir, {recursive: true})
})

test('test run', async() => {
  if (!(process.env.VADDY_FQDN)) {
    console.log('VADDY_FQDN is empty')
    return
  }
  process.env.INPUT_USER = process.env.VADDY_USER
  process.env.INPUT_AUTH_KEY = process.env.VADDY_AUTH_KEY
  process.env.INPUT_FQDN = process.env.VADDY_FQDN
  process.env.INPUT_VERIFICATION_CODE = process.env.VADDY_VERIFICATION_CODE
  process.env.INPUT_PRIVATE_KEY = process.env.VADDY_PRIVATE_KEY
  process.env.INPUT_LOCAL_IP = process.env.VADDY_YOUR_LOCAL_IP
  process.env.INPUT_LOCAL_PORT = process.env.VADDY_YOUR_LOCAL_PORT
  const ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
});

test('test run with private_key', async() => {
  if (!(process.env.VADDY_FQDN)) {
    console.log('VADDY_FQDN is empty')
    return
  }
  process.env.INPUT_USER = process.env.VADDY_USER
  process.env.INPUT_AUTH_KEY = process.env.VADDY_AUTH_KEY
  process.env.INPUT_FQDN = process.env.VADDY_FQDN
  process.env.INPUT_VERIFICATION_CODE = process.env.VADDY_VERIFICATION_CODE
  process.env.INPUT_LOCAL_IP = process.env.VADDY_YOUR_LOCAL_IP
  process.env.INPUT_LOCAL_PORT = process.env.VADDY_YOUR_LOCAL_PORT
  const ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
});

test('test run with crawl_id', async() => {
  if (!(process.env.VADDY_FQDN)) {
    console.log('VADDY_FQDN is empty')
    return
  }
  process.env.INPUT_USER = process.env.VADDY_USER
  process.env.INPUT_AUTH_KEY = process.env.VADDY_AUTH_KEY
  process.env.INPUT_FQDN = process.env.VADDY_FQDN
  process.env.INPUT_VERIFICATION_CODE = process.env.VADDY_VERIFICATION_CODE
  process.env.INPUT_LOCAL_IP = process.env.VADDY_YOUR_LOCAL_IP
  process.env.INPUT_LOCAL_PORT = process.env.VADDY_YOUR_LOCAL_PORT
  process.env.INPUT_CRAWL_ID = process.env.VADDY_CRAWL_ID
  const ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
});

test('test run with private_key and crawl_id', async() => {
  if (!(process.env.VADDY_FQDN)) {
    console.log('VADDY_FQDN is empty')
    return
  }
  process.env.INPUT_USER = process.env.VADDY_USER
  process.env.INPUT_AUTH_KEY = process.env.VADDY_AUTH_KEY
  process.env.INPUT_FQDN = process.env.VADDY_FQDN
  process.env.INPUT_VERIFICATION_CODE = process.env.VADDY_VERIFICATION_CODE
  process.env.INPUT_PRIVATE_KEY = process.env.VADDY_PRIVATE_KEY
  process.env.INPUT_LOCAL_IP = process.env.VADDY_YOUR_LOCAL_IP
  process.env.INPUT_LOCAL_PORT = process.env.VADDY_YOUR_LOCAL_PORT
  process.env.INPUT_CRAWL_ID = process.env.VADDY_CRAWL_ID
  const ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
});

test('test run V2', async() => {
  if (!(process.env.VADDY_PROJECT_ID)) {
    console.log('VADDY_PROJECT_ID is empty')
    return
  }
  process.env.INPUT_USER = process.env.VADDY_USER
  process.env.INPUT_AUTH_KEY = process.env.VADDY_AUTH_KEY
  process.env.INPUT_PROJECT_ID = process.env.VADDY_PROJECT_ID
  const ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
});


test('test run V2 with crawl_id', async() => {
  if (!(process.env.VADDY_PROJECT_ID)) {
    console.log('VADDY_PROJECT_ID is empty')
    return
  }
  process.env.INPUT_USER = process.env.VADDY_USER
  process.env.INPUT_AUTH_KEY = process.env.VADDY_AUTH_KEY
  process.env.INPUT_PROJECT_ID = process.env.VADDY_PROJECT_ID
  process.env.INPUT_CRAWL_ID = process.env.VADDY_CRAWL_ID
  const ip = path.join(__dirname, 'index.js');
  console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
});

