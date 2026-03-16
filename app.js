const express = require("express")
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.use(express.json())

/* CONEXION BASE DE DATOS */

const db = new sqlite3.Database("productos.db", (err) => {
    if (err) {
        console.log("Error al conectar con la base de datos")
    } else {
        console.log("Base de datos conectada")
    }
})

/* CREAR TABLA */

db.serialize(() => {

    db.run(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        stock INTEGER,
        precio REAL
    )
    `)

    /* DATOS INICIALES */

    db.run(`
    INSERT INTO productos (nombre, stock, precio)
    SELECT 'jeans oxford', 10, 20000
    WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'jeans oxford')
    `)

    db.run(`
    INSERT INTO productos (nombre, stock, precio)
    SELECT 'campera chorizo', 15, 30000
    WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'campera chorizo')
    `)

    db.run(`
    INSERT INTO productos (nombre, stock, precio)
    SELECT 'cartera', 5, 25000
    WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'cartera')
    `)

})

/* GET TODOS LOS PRODUCTOS */

app.get("/productos", (req, res) => {

    db.all("SELECT * FROM productos", [], (err, rows) => {

        if (err) {
            res.status(500).json({ error: err.message })
            return
        }

        res.json(rows)

    })

})

/* GET PRODUCTO POR ID */

app.get("/productos/:id", (req, res) => {

    const id = req.params.id

    db.get("SELECT * FROM productos WHERE id = ?", [id], (err, row) => {

        if (err) {
            res.status(500).json({ error: err.message })
            return
        }

        if (!row) {
            res.json({ mensaje: "Producto no encontrado" })
        } else {
            res.json(row)
        }

    })

})

/* LEVANTAR SERVIDOR */

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000")
})