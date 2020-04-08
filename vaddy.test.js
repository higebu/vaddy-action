const VAddy = require('./vaddy')
const httpm = jest.genMockFromModule('@actions/http-client')

test('test new VAddy', async() => {
    let vaddy = new VAddy("user", "auth_key", "fqdn", "verification_code")
    expect(vaddy).not.toBe(undefined)
    expect(vaddy.crawlId).toBe(undefined)
})

test('test new VAddy with crawl_id', async() => {
    let vaddy = new VAddy("user", "auth_key", "fqdn", "verification_code", "crawl_id")
    expect(vaddy).not.toBe(undefined)
    expect(vaddy.crawlId).toBe("crawl_id")
})
