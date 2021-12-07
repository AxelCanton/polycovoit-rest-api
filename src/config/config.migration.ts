module.exports = {
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    migrationsTableName: 'migration',

    migrations: ['src/migration/*.ts'],

    cli: {
      migrationsDir: 'src/migration',
    }, 
}