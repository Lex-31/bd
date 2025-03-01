const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = new Pool({
    user: 'myuser',
    host: 'localhost', // Используйте имя сервиса базы данных из docker-compose
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
});

async function ensureTableExists() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS mytable (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INT
      );
    `);
        const result = await client.query('SELECT * FROM mytable');
        if (result.rowCount === 0) {
            await client.query(`
        INSERT INTO mytable (name, age) VALUES
        ('Alice', 30),
        ('Bob', 25),
        ('Charlie', 35);
      `);
        }
    } finally {
        client.release();
    }
}

app.get('/test', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM mytable');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
});

const PORT = 3000;

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Опционально: завершить процесс с ошибкой
    // process.exit(1);
});

ensureTableExists().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
