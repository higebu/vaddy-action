var config = require('./jest.config')

config.collectCoverage = false
config.testMatch = ["**/?(*.)+(ispec|itest).[tj]s?(x)"]

module.exports = config
