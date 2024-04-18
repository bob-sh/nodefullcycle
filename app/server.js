const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'db',
    user: 'userdb',
    password: 'passstrong',
    database: 'nodedb',
    port: 3306
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

// Rota para criar a tabela e inserir dados
app.get('/', (req, res) => {
    // Consulta SQL para criar a tabela 'people' se ela não existir
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;

    // Executa a consulta para criar a tabela
    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar a tabela:', err);
            res.status(500).send('Erro ao criar a tabela');
            return;
        }
        console.log('Tabela criada com sucesso!');
        
        // Dados a serem inseridos
        const nomeAleatorio = 'João' + Math.random();
        const dados = { name: nomeAleatorio };

        // Executa a consulta para inserir os dados
        connection.query('INSERT INTO people SET ?', dados, (err, result) => {
            if (err) {
                console.error('Erro ao inserir dados:', err);
                res.status(500).send('Erro ao inserir dados');
                return;
            }
            console.log('Dados inseridos com sucesso:', result);

            // Executa a consulta para selecionar todos os registros da tabela 'people'
            connection.query('SELECT * FROM people', (err, results) => {
                if (err) {
                    console.error('Erro ao selecionar dados:', err);
                    res.status(500).send('Erro ao selecionar dados');
                    return;
                }
                // Envia uma resposta HTML com os dados da tabela 'people'
                res.send(`
                    <h1>Full Cycle Rocks!</h1>
                    <ol>${results.map(item => `<li>${item.name}</li>`).join('')}</ol>
                `);
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
