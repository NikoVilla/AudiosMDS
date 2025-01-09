const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
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

const db = new sqlite3.Database('gestor_archivos.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS archivos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruta TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    duracion INTEGER,
    texto TEXT
  )`);
});

const media = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'media_uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: media });

app.use('/media', express.static(path.join(__dirname, 'media_uploads')));

app.post('/upload-media', auth.verifyToken, upload.array('files'), (req, res) => {
  const { showNow, is24Hours, startDate, startTime, endDate, endTime, text } = req.body;
  const files = req.files;

  let fechaInicio = null;
  let fechaFin = null;
  let duracion = null;

  if (showNow) {
    duracion = parseInt(showNow);
    fechaInicio = new Date();
    fechaFin = new Date(fechaInicio.getTime() + duracion * 1000);
  } else if (is24Hours) {
    duracion = parseInt(is24Hours);
    fechaInicio = new Date();
    fechaFin = new Date(fechaInicio.getTime() + duracion * 1000);
  } else if (startDate && startTime && endDate && endTime) {
    fechaInicio = new Date(`${startDate}T${startTime}`);
    fechaFin = new Date(`${endDate}T${endTime}`);
  }

  if (files && files.length > 0) {
    files.forEach(file => {
      const ruta = file.path;

      db.run("INSERT INTO archivos (ruta, fecha_inicio, fecha_fin, duracion, texto) VALUES (?, ?, ?, ?, ?)", 
        [ruta, fechaInicio, fechaFin, duracion, text || null], (err) => {
          if (err) {
            console.error(err.message);
          }
        });
    });
    res.status(200).json({ message: 'Archivos subidos y datos guardados correctamente' });
  } else {
    res.status(400).json({ message: 'No se han subido archivos.' });
  }
});

// function eliminarArchivosExpirados() {
//   const now = new Date();
//   const margen = 30 * 1000;

//   db.all("SELECT id, ruta, fecha_fin FROM archivos", [], (err, rows) => {
//     if (err) {
//       console.error(err.message);
//       return;
//     }

//     rows.forEach((row) => {
//       const fechaFin = new Date(row.fecha_fin);

//       // Verificar si el archivo ha expirado hace más de un minuto
//       if (fechaFin <= new Date(now.getTime() - margen)) {

//         if (fs.existsSync(row.ruta)) {
//           fs.unlinkSync(row.ruta);
//           console.log(`Archivo eliminado: ${row.ruta}`);
//         }

//         // Eliminar de la base de datos
//         db.run("DELETE FROM archivos WHERE id = ?", [row.id], (err) => {
//           if (err) {
//             console.error(err.message);
//           }
//         });
//       }
//     });
//   });
// }

// cron.schedule('* * * * *', () => {
//   eliminarArchivosExpirados();
// });

app.get('/media', auth.verifyToken, (req, res) => {
  const uploadDir = path.join(__dirname, 'media_uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error al leer los archivos.' });
    }
    const mediaFiles = files.map(file => ({
      filename: file,
      path: `/media/${file}`
    }));
    res.status(200).json(mediaFiles);
  });
});

app.get('/media-full', (req, res) => {
  const imagesDir = './media_uploads';

  // Leer archivos del directorio
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error al leer el directorio:', err);
      return res.status(500).json({ error: 'No se pudo leer el directorio' });
    }

    // Consultar la base de datos
    db.all("SELECT ruta, duracion FROM archivos", [], (err, rows) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err.message);
        return res.status(500).json({ message: 'Error al consultar la base de datos' });
      }

      // Crear un mapa con la información de la base de datos para fácil acceso
      const dbData = rows.reduce((acc, row) => {
        const fileName = path.basename(row.ruta); // Extraer solo el nombre del archivo
        acc[fileName] = { duracion: row.duracion || 0 }; // Agregar duración
        return acc;
      }, {});

      // Combinar información del directorio y la base de datos
      const mediaData = files.map(file => ({
        name: file,
        url: `${process.env.BASE_URL}/media/${file}`,
        duracion: dbData[file]?.duracion || 0, // Si no está en la BD, asignar duración 0
      }));

      res.status(200).json(mediaData);
    });
  });
});

app.delete('/media/:filename', auth.verifyToken, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'media_uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el archivo.' });
    }
    res.status(200).json({ message: 'Archivo eliminado correctamente.' });
  });
});

const db2 = new sqlite3.Database('publicidad.db');

db2.serialize(() => {
  db2.run(`CREATE TABLE IF NOT EXISTS publicidad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruta TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    duracion INTEGER,
    texto TEXT
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
  const { showNow, is24Hours, startDate, startTime, endDate, endTime, text } = req.body;
  const files = req.files;

  let fechaInicio = null;
  let fechaFin = null;
  let duracion = null;

  if (showNow) {
    duracion = parseInt(showNow);
    fechaInicio = new Date();
    fechaFin = new Date(fechaInicio.getTime() + duracion * 1000);
  } else if (is24Hours) {
    duracion = parseInt(is24Hours);
    fechaInicio = new Date();
    fechaFin = new Date(fechaInicio.getTime() + duracion * 1000);
  } else if (startDate && startTime && endDate && endTime) {
    fechaInicio = new Date(`${startDate}T${startTime}`);
    fechaFin = new Date(`${endDate}T${endTime}`);
  }

  if (files && files.length > 0) {
    files.forEach(file => {
      const ruta = file.path;

      db2.run("INSERT INTO publicidad (ruta, fecha_inicio, fecha_fin, duracion, texto) VALUES (?, ?, ?, ?, ?)", 
        [ruta, fechaInicio, fechaFin, duracion, text || null], (err) => {
          if (err) {
            console.error(err.message);
          }
        });
    });
    res.status(200).json({ message: 'Archivos subidos y datos guardados correctamente' });
  } else {
    res.status(400).json({ message: 'No se han subido archivos.' });
  }
});

// Función para eliminar archivos expirados
function eliminarArchivosExpira2() {
  const now = new Date();
  const margen = 30 * 1000; // 1 minuto en milisegundos

  db2.all("SELECT id, ruta, fecha_fin FROM publicidad", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    rows.forEach((row) => {
      const fechaFin = new Date(row.fecha_fin);

      if (fechaFin <= new Date(now.getTime() - margen)) {
        if (fs.existsSync(row.ruta)) {
          fs.unlinkSync(row.ruta);
          console.log(`Archivo eliminado: ${row.ruta}`);
        }

        db.run("DELETE FROM archivos WHERE id = ?", [row.id], (err) => {
          if (err) {
            console.error(err.message);
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
    console.log('Archivos encontrados:', files); // Log adicional
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
  console.log('Eliminando archivo:', filePath); // Log adicional

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error al eliminar el archivo:', err); // Log adicional
      return res.status(500).json({ message: 'Error al eliminar el archivo.' });
    }
    res.status(200).json({ message: 'Archivo eliminado correctamente.' });
  });
});

app.use(express.static('uploads'));
app.use('/images', express.static('./publicidad_uploads'));
app.use(bodyParser.json());

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