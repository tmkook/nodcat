module.exports = {
    env: process.env.APP_ENV ?? 'dev',
    key: process.env.APP_KEY ?? 'encrypto_key',
    port: process.env.APP_PORT ?? '3000',
    name: process.env.APP_NAME ?? 'nodcat',
    debug: process.env.APP_DEBUG == 'true',

    log: process.env.LOG ?? 'stack',
    log_level: process.env.LOG_LEVEL ?? '',
    host: process.env.HOST ?? 'localhost',
    protocol: process.env.PROTOCOL ?? 'http',
    asset_url: process.env.ASSET_URL ?? '/',
    timezone: process.env.TIMEZONE ?? 'Asia/Shanghai',
}