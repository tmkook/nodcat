module.exports = {
    master: {
        client: process.env.DB_CLIENT ?? 'mysql2',
        connection: {
            host: process.env.DB_HOST ?? '127.0.0.1',
            port: process.env.DB_PORT ?? 3306,
            user: process.env.DB_USER ?? 'root',
            password: process.env.DB_PASSWORD ?? '',
            database: process.env.DB_DATABASE ?? 'test',
        }
    },
    // second: {
    //     client: process.env.DB_CLIENT2,
    //     connection: {
    //         host: process.env.DB_HOST2,
    //         port: process.env.DB_PORT2,
    //         user: process.env.DB_USERNAME2,
    //         password: process.env.DB_PASSWORD2,
    //         database: process.env.DB_DATABASE2,
    //     }
    // }
}