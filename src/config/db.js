const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOTS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 1000
});

const testConexionDB = async () => {
    try {
        const cliente = await pool.connect();
        const resultado = await cliente.query('SELECT NOW()');
        console.log('Conexión exitosa a PostgreSQL');    
        console.log('Hora del Servidor DB', resultado.rows[0].now);
        cliente.release();
    } catch(error) {
        console.log('Error al conectar a la base de datos', error.message);
    }
};

/* const query = (text, params) => {
    return pool.query(text, params)
} */
const query = (text, params) => pool.query(text, params);

module.exports = {
    pool,
    testConexionDB,
    query
}