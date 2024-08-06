import express from "express"
import cors from 'cors'
import path from "path"
import { fileURLToPath } from "url"


// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())

app.get("/", (req, res) => {
  res.sendFile("views/index.html", { root: __dirname })
})

app.get("/api/data", async (req, res) => {
  const query = req.query.query // Recuperar el parámetro 'query' de la URL
  console.log(`Query recibido: ${query}`)

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
