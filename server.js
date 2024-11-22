// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importar cors

// Crear una aplicación de Express
const app = express();

// Configuración de puerto
const PORT = 3001;
app.use(cors());
// Middleware para analizar JSON
app.use(express.json());

// Configuración de conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'autorack.proxy.rlwy.net', // Hostname proporcionado
    port: 23672, // Puerto proporcionado
    user: 'root', // Usuario
    password: 'gDvolcrIHTvtMfSpDxzyXYQAuEXKEOot', // Contraseña
    database: 'railway' // Nombre de la base de datos
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

// Rutas GET
app.get('/api/familia_brayan', (req, res) => {
    const query = 'SELECT * FROM familia WHERE id_familia = 2 OR id_familia = 3';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al ejecutar el query:', err);
            res.status(500).send('Error en el servidor');
            return;
        }
        // console.log(results)
        res.status(200).json(results); // Enviar resultados como JSON
    });
  });

// Rutas POST
app.post('/api/asignar-intercambio', (req, res) => {
//   const { id, id_asignado } = req.body;
// //   const query = 'INSERT INTO items (nombre, descripcion) VALUES (?, ?)';
//   const query = `UPDATE familia SET asignado = 1 WHERE id = ${id_asignado} AND UPDATE UPDATE familia SET INTERCAMBIO = ${id_asignado} WHERE id = ${id}`;
//   db.query(query, [nombre, descripcion], (err, result) => {
//     if (err) {
//       console.error('Error al insertar los datos:', err);
//       res.status(500).json({ error: 'Error al insertar los datos' });
//     } else {
//       res.json({ message: 'Elemento insertado correctamente', id: result.insertId });
//     }
//   });

const { id, id_asignado } = req.body;
console.log(id, id_asignado)
const query1 = `UPDATE familia SET asignado = 1 WHERE id = ?`;
const query2 = `UPDATE familia SET intercambio = ? WHERE id = ?`;

// Ejecutar primera consulta
db.query(query1, [id_asignado], (err, result1) => {
  if (err) {
    return db.rollback(() => {
      res.status(500).json({ error: 'Error en la primera actualización.' });
    });
  }

  // Ejecutar segunda consulta
  db.query(query2, [id_asignado, id], (err, result2) => {
    if (err) {
      return db.rollback(() => {
        res.status(500).json({ error: 'Error en la segunda actualización.' });
      });
    }

    // Confirmar transacción
    db.commit((err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: 'Error al confirmar la transacción.' });
        });
      }

      res.json({ message: 'Actualizaciones realizadas con éxito.' });
    });
  });
 });
});

// Rutas PUT
app.put('/api/asignar-intercambio/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const query = 'UPDATE items SET nombre = ?, descripcion = ? WHERE id = ?';
  db.query(query, [nombre, descripcion, id], (err) => {
    if (err) {
      console.error('Error al actualizar los datos:', err);
      res.status(500).json({ error: 'Error al actualizar los datos' });
    } else {
      res.json({ message: 'Elemento actualizado correctamente' });
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
