
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test'
});

// 1. Vulnerabilidad de Inyección de SQL
app.get('/user', (req, res) => {
  const userId = req.query.id;

  const query = "SELECT * FROM users WHERE id = '" + userId + "'"; 
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// 2. Vulnerabilidad de Cross-Site Scripting (XSS)
app.get('/greet', (req, res) => {
  const name = req.query.name;
  res.send(`<h1>Hello, ${name}!</h1>`); // XSS si el nombre no está sanitizado
});

// 3. Uso de métodos criptográficos débiles
function hashPassword(password) {

  return crypto.createHash('md5').update(password).digest('hex'); 
}

console.log('Hash MD5 de la contraseña "password":', hashPassword('password'));

// 4. Ejemplo de información sensible expuesta
const SECRET_API_KEY = "sk_test_1234567890abcdef";
console.log(`Using API Key: ${SECRET_API_KEY}`); 

// 5. Uso de funciones criptográficas inseguras
const encrypted = crypto.createCipher('des', 'key').update('data', 'utf8', 'hex');
console.log('Datos cifrados con DES:', encrypted);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
