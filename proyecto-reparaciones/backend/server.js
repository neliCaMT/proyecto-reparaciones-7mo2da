const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // <-- ¡ACÁ ESTABA EL PERMISO QUE FALTABA!
const app = express();
const port = 3000;

app.use(cors()); // <-- Y ACÁ LE DECIMOS QUE LO USE
app.use(express.json());

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reparaciones_db'
});

connection.connect(error => {
    if (error) throw error;
    console.log("¡Cunectau a la base de datos, chango!");
});

// --- RUTAS (ENDPOINTS) PARA EL ABM ---

// LEER (SELECT): Traer todos los tickets
app.get('/tickets', (req, res) => {
    connection.query("SELECT * FROM tickets", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// ALTA (INSERT): Crear un ticket nuevo
app.post('/tickets', (req, res) => {
    const { cliente, equipo, problema, estado } = req.body;
    const sql = "INSERT INTO tickets (cliente, equipo, problema, estado) VALUES (?, ?, ?, ?)";
    connection.query(sql, [cliente, equipo, problema, estado], (err, result) => {
        if (err) throw err;
        res.json({ message: '¡Ticket creau!', id: result.insertId });
    });
});

// MODIFICACIÓN (UPDATE): Editar un ticket existente
app.put('/tickets/:id', (req, res) => {
    const { id } = req.params;
    const { cliente, equipo, problema, estado } = req.body;
    const sql = "UPDATE tickets SET cliente = ?, equipo = ?, problema = ?, estado = ? WHERE id = ?";
    connection.query(sql, [cliente, equipo, problema, estado, id], (err) => {
        if (err) throw err;
        res.json({ message: '¡Ticket modificau!' });
    });
});

// BAJA (DELETE): Eliminar un ticket
app.delete('/tickets/:id', (req, res) => {
    const { id } = req.params;
    connection.query("DELETE FROM tickets WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.json({ message: '¡Ticket borrau!' });
    });
});

app.listen(port, () => {
    console.log(`Servidor andando en http://localhost:${port}`);
});