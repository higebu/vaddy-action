const httpm = require('@actions/http-client')
const querystring = require('querystring');

const endpoint = 'https://api.vaddy.net'
const api_version_v1 = '/v1'

class VAddy {
  constructor(user, authKey, fqdn, verificationCode, crawlId) {
    this.user = user
    this.authKey = authKey
    this.fqdn = fqdn
    this.verificationCode = verificationCode
    if (crawlId) {
      this.crawlId = crawlId
    }
    this.http = new httpm.HttpClient('actions-vaddy')
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
}

module.exports = VAddy
