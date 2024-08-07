import express from "express"
import cors from 'cors'
import path from "path"
import { fileURLToPath } from "url"
import sqlite3 from 'sqlite3';


// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())

app.get("/", (req, res) => {
  res.sendFile("views/index.html", { root: __dirname })
})

const db = new sqlite3.Database('./mi_base_de_datos.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos SQLite');
});

app.get('/datos', (req, res) => {
  const sql = 'SELECT * FROM mi_tabla';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send('Error al obtener datos');
      return;
    }
    res.json(rows);
  });
});

app.get("/api/data", async (req, res) => {
  const query = req.query.query

  try {
    if (query == null || query == "") {
      const response = await fetch('https://fakestoreapi.com/products/categories')
      const result = await response.json()
      res.send(result)
    }
    else {
      const response = await fetch(`https://fakestoreapi.com/products/category/${query}`)
      const result = await response.json()
      res.send(result)
    }

  } catch (error) {
    console.error("Error al consumir la API externa:", error)
    res.status(500).json({ error: "Error al consumir la API externa" })
  }
})


app.listen(3000, function () {
  console.log("escuchando el puerto 3000!")
})
