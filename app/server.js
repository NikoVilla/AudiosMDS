const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const schedule = require('node-schedule');
const cron = require('node-cron');
const auth = require('./auth');
const app = express();
require('dotenv').config();
const port = 3001;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db2 = new sqlite3.Database('publicidad.db');

db2.serialize(() => {
  db2.run(`CREATE TABLE IF NOT EXISTS publicidad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruta TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    duracion INTEGER,
    shownow INTEGER,
    fijo INTEGER
  )`);
});

const publicidad = multer.diskStorage({
  destination: (req, file, cb) => {
    const publicidadDir = path.join(__dirname, 'publicidad_uploads');
    if (!fs.existsSync(publicidadDir)) {
      fs.mkdirSync(publicidadDir);
    }
    cb(null, publicidadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const publicidadUpload = multer({ storage: publicidad });

app.use('/marketing', express.static(path.join(__dirname, 'publicidad_uploads')));

app.post('/upload-publicidad', auth.verifyToken, publicidadUpload.array('files'), (req, res) => {
  const { shownow, is24Hours, startDate, startTime, endDate, endTime } = req.body;
  const files = req.files;

  let fechaInicio = null;
  let fechaFin = null;
  let duracion = null;
  // let shownowValue = shownow ? parseInt(shownow) : null; // Si `shownow` es vacío, se asigna NULL.
  let shownowValue = shownow && parseInt(shownow) !== 0 ? parseInt(shownow) : null; // Si `shownow` es 0 o vacío, se asigna NULL.


  if (shownowValue) {
    // Si se proporciona `shownow`, calcular las fechas de inicio y fin
    duracion = shownowValue;
    fechaInicio = new Date();
    fechaFin = new Date(fechaInicio.getTime() + duracion * 1000);
    console.log("Mostrando ahora:", { fechaInicio, fechaFin, duracion });
  } else if (is24Hours) {
    // Manejo de imágenes con duración de 24 horas
    duracion = parseInt(is24Hours);
    fechaInicio = new Date();
    fechaFin = new Date(fechaInicio.getTime() + duracion * 1000);
    console.log("Programado para 24 horas:", { fechaInicio, fechaFin, duracion });
  } else if (startDate && startTime && endDate && endTime) {
    // Manejo de fechas específicas
    fechaInicio = new Date(`${startDate}T${startTime}`);
    fechaFin = new Date(`${endDate}T${endTime}`);
    console.log("Programado con fechas específicas:", { fechaInicio, fechaFin });
  }

  if (files && files.length > 0) {
    files.forEach(file => {
      const ruta = file.path;

      db2.run(
        "INSERT INTO publicidad (ruta, fecha_inicio, fecha_fin, duracion, shownow, fijo) VALUES (?, ?, ?, ?, ?, ?)", 
        [ruta, fechaInicio, fechaFin, duracion || null, shownowValue], 
        (err) => {
          if (err) {
            console.error("Error al insertar en la base de datos:", err.message);
          }
        }
      );
    });
    res.status(200).json({ message: 'Archivos subidos y datos guardados correctamente' });
  } else {
    res.status(400).json({ message: 'No se han subido archivos.' });
  }
});

function eliminarArchivosExpira2() {
  const now = new Date();

  db2.all("SELECT id, ruta, fecha_fin, shownow FROM publicidad", [], (err, rows) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err.message);
      return;
    }

    rows.forEach((row) => {
      const fechaFin = new Date(row.fecha_fin);

      // Si shownow es -1, ignorar el archivo (no tiene fecha de caducidad).
      if (row.shownow === -1) {
        // console.log(`Elemento con id ${row.id} no tiene caducidad. Ignorado.`);
        return;
      }

      // Si la fecha de caducidad ha pasado o el valor de shownow indica que debe eliminarse
      if (fechaFin <= now || (row.shownow > 0 && fechaFin <= now)) {
        // Eliminar el archivo si existe
        if (fs.existsSync(row.ruta)) {
          fs.unlinkSync(row.ruta);
          console.log(`Archivo eliminado: ${row.ruta}`);
        }

        // Eliminar la entrada de la base de datos
        db2.run("DELETE FROM publicidad WHERE id = ?", [row.id], (err) => {
          if (err) {
            console.error("Error al eliminar de la base de datos:", err.message);
          } else {
            console.log(`Entrada eliminada de la base de datos: id ${row.id}`);
          }
        });
      }
    });
  });
}

cron.schedule('* * * * *', () => {
  eliminarArchivosExpira2();
});

app.get('/marketing', auth.verifyToken, (req, res) => {
  const publicidadDir = path.join(__dirname, 'publicidad_uploads');
  // console.log('Leyendo archivos de:', publicidadDir); // Log adicional
  fs.readdir(publicidadDir, (err, files) => {
    if (err) {
      console.error('Error al leer los archivos:', err); // Log adicional
      return res.status(500).json({ message: 'Error al leer los archivos.' });
    }
    console.log('Archivos encontrados:', files); 
    const publicidadFiles = files.map(file => ({
      filename: file,
      path: `/marketing/${file}`
    }));
    res.status(200).json(publicidadFiles);
  });
});

app.delete('/marketing/:filename', auth.verifyToken, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'publicidad_uploads', filename);
  console.log('Eliminando archivo:', filePath);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error al eliminar el archivo:', err);
      return res.status(500).json({ message: 'Error al eliminar el archivo.' });
    }
    // Eliminar la referencia de la base de datos
    db2.run("DELETE FROM publicidad WHERE ruta LIKE ?", [`%${filename}%`], (dbErr) => {
      if (dbErr) {
        console.error('Error al eliminar la referencia de la base de datos:', dbErr.message);
        return res.status(500).json({ message: 'Error al eliminar la referencia en la base de datos.' });
      }
      
      res.status(200).json({ message: 'Archivo y referencia eliminados correctamente.' });
    });
  });
});

// ######################################## Imagen Fija ####################################################

app.get('/get-status', (req, res) => {
  db2.all("SELECT ruta, fijo FROM publicidad", [], (err, rows) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err.message);
      return res.status(500).json({ message: 'Error al consultar la base de datos.' });
    }

    // ########################################### Cambiar ruta al hacer build ###############################
    const baseUrl = 'http://localhost:3001/images';
    const statuses = rows.map(row => ({
      image: `${baseUrl}/${row.ruta.split('\\').pop()}`,
      status: row.fijo > 0 ? 'activo' : 'inactivo',
    }));

    res.status(200).json(statuses);
  });
});

app.post('/set-time', (req, res) => {
  const { imageName, fijo } = req.body;

  if (!imageName || fijo === undefined) {
    return res.status(400).json({ message: 'Datos incompletos: se requieren imageName y fijo.' });
  }

  db2.serialize(() => {
    // Si el valor de `fijo` es mayor que 0, asegurarse de desactivar todas las demás imágenes
    if (fijo > 0) {
      db2.run("UPDATE publicidad SET fijo = 0 WHERE ruta NOT LIKE ?", [`%${imageName}%`], (err) => {
        if (err) {
          console.error("Error al desactivar otras imágenes:", err.message);
          return res.status(500).json({ message: 'Error al desactivar otras imágenes.' });
        }
      });
    }

  db2.run(
    "UPDATE publicidad SET fijo = ? WHERE ruta LIKE ?",
    [fijo, `%${imageName}%`],
    function (err) {
      if (err) {
        console.error("Error al actualizar la base de datos:", err.message);
        return res.status(500).json({ message: 'Error al actualizar la base de datos.' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Imagen no encontrada en la base de datos.' });
      }

      res.status(200).json({ message: 'Valor de fijo actualizado correctamente.' });
      }
    );
  });
});

const checkTimers = () => {
  db2.all("SELECT ruta, fijo FROM publicidad", [], (err, rows) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err.message);
      return;
    }

    rows.forEach(row => {
      if (row.fijo > 0) {
        const nuevoFijo = row.fijo - 1;

        console.log(`Imagen: ${row.ruta} | Tiempo restante: ${nuevoFijo}s`);

        db2.run(
          "UPDATE publicidad SET fijo = ? WHERE ruta = ?",
          [nuevoFijo, row.ruta],
          function (err) {
            if (err) {
              console.error("Error al actualizar la base de datos:", err.message);
              return;
            }

            if (nuevoFijo === 0) {
              console.log(`La imagen ${row.ruta} ahora está inactiva.`);
            }
          }
        );
      }
    });
  });
};

setInterval(checkTimers, 1000);

app.use(express.static('uploads'));
app.use('/images', express.static('./publicidad_uploads'));
app.use(bodyParser.json());

// ################################ Material animación ################################################

let currentTrack = null;

app.get('/files', (req, res) => {
  const files = [
    {
      index: 0,
      url: `${process.env.BASE_URL}/jackpot.mp3`,
      title: 'Jackpot',
      imageUrl: `${process.env.BASE_URL}/bjack.gif`
    },
    {
      index: 1,
      url: `${process.env.BASE_URL}/superjackpot.mp3`,
      title: 'Super Jackpot',
      imageUrl: `${process.env.BASE_URL}/bsuper.gif`
    }
  ];
  res.json(files);
});

app.post('/select-track', (req, res) => {
  currentTrack = req.body.url ? req.body : null;
  // console.log('Track selected on server:', currentTrack);
  res.sendStatus(200);
});

app.get('/current-track', (req, res) => {
  res.json(currentTrack);
});

app.get('/images-list', (req, res) => {
  const imagesDir = './publicidad_uploads';
  // console.log('Reading directory:', imagesDir);
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return res.status(500).json({ error: 'Unable to scan directory' });
    }
    const imageFiles = files.map(file => ({
      name: file,
      url: `${process.env.BASE_URL}/images/${file}`
    }));
    // console.log('Images list:', imageFiles);
    res.json(imageFiles);
  });
});

// ################################ Tabla usuarios ################################################

app.post('/usuarios', (req, res) => {
  const { first_name, last_name, username, role, password } = req.body;
  auth.createUser(first_name, last_name, username, role, password, (err, newUser) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Error al crear el usuario' });
    } else {
      res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
    }
  });
});

app.get('/usuario-logueado', auth.verifyToken, (req, res) => {
  const userId = req.userId;
  auth.getUserById(userId, (err, user) => {
    if (err) {
      console.error('Error fetching logged-in user:', err);
      res.status(500).json({ message: 'Error al obtener el usuario logueado' });
    } else {
      res.json({ message: 'Usuario logueado obtenido con éxito', usuario: user });
    }
  });
});

app.get('/usuarios', auth.verifyToken, (req, res) => {
  auth.getAllUsers((err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Error al obtener usuarios' });
    } else {
      res.json({ message: 'Usuarios obtenidos con éxito', usuarios: users });
    }
  });
});

app.get('/usuarios/:id', auth.verifyToken, (req, res) => {
  const userId = req.params.id;
  auth.getUserById(userId, (err, user) => {
    if (err) {
      console.error('Error fetching user by ID:', err);
      res.status(500).json({ message: 'Error al obtener el usuario' });
    } else {
      res.json({ message: 'Usuario obtenido con éxito', usuario: user });
    }
  });
});

app.delete('/usuarios/:id', auth.verifyToken, (req, res) => {
  const { id } = req.params;
  auth.deleteUser(id, (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: 'Error al eliminar el usuario' });
    } else {
      res.status(200).json({ message: 'Usuario eliminado con éxito' });
    }
  });
});

app.put('/usuarios/:id', auth.verifyToken, (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, username, role, password } = req.body;

  auth.updateUser(id, { first_name, last_name, username, role, password }, (err, updatedUser) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    } else {
      res.json({ message: 'Usuario actualizado con éxito', user: updatedUser });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  auth.login(username, password, (err, token) => {
    if (err) {
      console.error('Authentication failed:', err);
      res.status(401).json({ message: 'Autenticación fallida' });
    } else {
      res.json({ message: 'Autenticación exitosa', token });
    }
  });
});

app.listen(port, () => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('es-ES', { hour12: false });
  console.log(`Servidor corriendo en el puerto ${port}`);
  console.log(`Hora actual del servidor: ${formattedTime}`);
});