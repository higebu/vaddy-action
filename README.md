# vaddy-action

GitHub Action to run vulnerability scan with [VAddy](https://vaddy.net/).

[![test](https://github.com/higebu/vaddy-action/workflows/test/badge.svg)](https://github.com/higebu/vaddy-action/actions)
[![codecov](https://codecov.io/gh/higebu/vaddy-action/branch/master/graph/badge.svg)](https://codecov.io/gh/higebu/vaddy-action)
[![CodeFactor](https://www.codefactor.io/repository/github/higebu/vaddy-action/badge)](https://www.codefactor.io/repository/github/higebu/vaddy-action)
[![Maintainability](https://api.codeclimate.com/v1/badges/61850855568e055c7624/maintainability)](https://codeclimate.com/github/higebu/vaddy-action/maintainability)

# Setting up this action

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
    - uses: higebu/vaddy-action@master
      with:
        user: ${{ secrets.VADDY_USER }}
        auth_key: ${{ secrets.VADDY_TOKEN }}
        project_id: ${{ secrets.VADDY_PROJECT_ID }}
        # crawl_id: ${{ secrets.VADDY_CRAWL_ID }}
```

## V1 project

If you want to scan the server runs on GitHub Actions, your project should be V1(VAddy PrivateNet) project. See [VAddy PrivateNet Quickstart Guide](https://support.vaddy.net/hc/en-us/sections/115002520287-VAddy-PrivateNet-Quickstart-Guide)

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
    - uses: higebu/vaddy-action@master
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

For more details, see [Example](https://github.com/higebu/vaddy-action-example) and [Workflow syntax for GitHub Actions](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions).


# Configurations

| input | description |
|:---:|---|
| `user`              | Vaddy User ID from https://console.vaddy.net/user/webapi. |
| `auth_key`          | Vaddy API Auth Key https://console.vaddy.net/user/webapi. |
| `project_id`        | A project ID from Server page. Required for V2 project. |
| `crawl_id`          | A crawl ID. Optional. |
| `fqdn`              | A FQDN of the server. Required for V1 project |
| `verification_code` | A verification code for the FQDN. Required for V1 project. |
| `private_key`       | A ssh private key. Optional for V1 project. You can get the key from `privatenet/vaddy/ssh/id_rsa` in [go-vaddy](https://github.com/vaddy/go-vaddy). After running `vaddy_privatenet.sh connect`. |
| `local_ip`          | A local IP address for the server. Required for V1 project |
| `local_port`        | A local port for the server. Required for V1 project |

| output | description |
|:---:|---|
| `scan_finished`   | `true` if the scan was finished, `false` otherwise. |
| `project_id`      | Project ID of the scan. |
| `scan_id`         | Scan ID of the scan. |
| `scan_count`      | Scan count of the scan. |
| `alert_count`     | Alert count of the scan. |
| `scan_result_url` | Scan result URL of the scan. |
| `complete`        | Complete of the scan. |
| `crawl_id`        | Crawl ID of the scan. |
| `crawl_label`     | Crawl label of the scan. |
| `scan_list`       | Scan list of the scan. |

# License

[MIT](LICENSE)