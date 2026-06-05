const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/reservas", (req, res) => {
  db.query("SELECT * FROM reservas ORDER BY fecha, hora_inicio", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/reservas", (req, res) => {
  const { cliente, telefono, fecha, hora_inicio, hora_fin, personas, mesa, estado, comentarios } = req.body;

  const validarMesa = `
    SELECT * FROM reservas
    WHERE fecha = ?
    AND mesa = ?
    AND estado != 'Cancelada'
    AND (? < hora_fin AND ? > hora_inicio)
  `;

  db.query(validarMesa, [fecha, mesa, hora_inicio, hora_fin], (err, conflictos) => {
    if (err) return res.status(500).json(err);

    if (conflictos.length > 0) {
      return res.status(400).json({
        mensaje: `${mesa} ya se encuentra reservada en ese horario. Seleccione otra mesa u otro horario.`
      });
    }

    const sql = `
      INSERT INTO reservas
      (cliente, telefono, fecha, hora_inicio, hora_fin, personas, mesa, estado, comentarios)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [cliente, telefono, fecha, hora_inicio, hora_fin, personas, mesa, estado, comentarios], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ mensaje: "Reserva registrada correctamente", id: result.insertId });
    });
  });
});

app.delete("/reservas/:id", (req, res) => {
  db.query("DELETE FROM reservas WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ mensaje: "Reserva eliminada correctamente" });
  });
});

app.listen(3000, () => {
  console.log("🚀 Servidor activo en: http://localhost:3000");
});
