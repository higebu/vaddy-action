# actions-vaddy

GitHub Action to run vulnerability scan with [VAddy](https://vaddy.net/).

[![test](https://github.com/higebu/actions-vaddy/workflows/test/badge.svg)](https://github.com/higebu/actions-vaddy/actions)
[![codecov](https://codecov.io/gh/higebu/actions-vaddy/branch/master/graph/badge.svg)](https://codecov.io/gh/higebu/actions-vaddy)
[![CodeFactor](https://www.codefactor.io/repository/github/higebu/actions-vaddy/badge)](https://www.codefactor.io/repository/github/higebu/actions-vaddy)
[![Maintainability](https://api.codeclimate.com/v1/badges/61850855568e055c7624/maintainability)](https://codeclimate.com/github/higebu/actions-vaddy/maintainability)

# Requirements

If you want to scan the server runs on GitHub Actions, your project should be V1(VAddy PrivateNet) project. See [VAddy PrivateNet Quickstart Guide](https://support.vaddy.net/hc/en-us/sections/115002520287-VAddy-PrivateNet-Quickstart-Guide)

* User ID and API Auth Key from https://console.vaddy.net/user/webapi.
* V2 project
    * Project ID from `Server` page.
* V1 project
    * FQDN.
    * Verification code of your FQDN
    * Private key for SSH tunnel(Optional)
        * You can get the key from `privatenet/vaddy/ssh/id_rsa` in [go-vaddy](https://github.com/vaddy/go-vaddy). After running `vaddy_privatenet.sh connect`
    * Local Web Server IP address
        * ex. `127.0.0.1`
    * Local Web Server Port Number

# Example

## V2 project

```yaml
name: test

on:
  schedule:
    - cron:  '0 3 * * *'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: higebu/actions-vaddy@master
      with:
        user: ${{ secrets.VADDY_USER }}
        auth_key: ${{ secrets.VADDY_TOKEN }}
        project_id: ${{ secrets.VADDY_PROJECT_ID }}
        # crawl_id: ${{ secrets.VADDY_CRAWL_ID }}
```

## V1 project

```yaml
name: test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: run server
      run: ./run.sh &
      env:
        VADDY_VERIFICATION_CODE: ${{ secrets.VADDY_VERIFICATION_CODE }}
        LISTEN_ADDR: ${{ secrets.VADDY_LOCAL_IP }}:${{ secrets.VADDY_LOCAL_PORT }}
    - uses: higebu/actions-vaddy@master
      with:
        user: ${{ secrets.VADDY_USER }}
        auth_key: ${{ secrets.VADDY_TOKEN }}
        fqdn: ${{ secrets.VADDY_FQDN }}
        verification_code: ${{ secrets.VADDY_VERIFICATION_CODE }}
        private_key: ${{ secrets.VADDY_PRIVATE_KEY }}
        local_ip: ${{ secrets.VADDY_LOCAL_IP }}
        local_port: ${{ secrets.VADDY_LOCAL_PORT }}
        # crawl_id: ${{ secrets.VADDY_CRAWL_ID }}
```

For more details, see [Example](https://github.com/higebu/actions-vaddy-example) and [Workflow syntax for GitHub Actions](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions).

# License

[MIT](LICENSE)