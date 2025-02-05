const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, username TEXT UNIQUE, role TEXT, password TEXT)');
  
  // Crear el administrador por defecto si no existe
  const defaultAdminUsername = 'admin';
  const defaultAdminPassword = bcrypt.hashSync('adminpassword', 10);
  db.run('INSERT OR IGNORE INTO users (first_name, last_name, username, role, password) VALUES (?, ?, ?, ?, ?)', 
    ['Default', 'Admin', defaultAdminUsername, 'Administrador', defaultAdminPassword]);
});

function createUser(first_name, last_name, username, role, password, callback) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (first_name, last_name, username, role, password) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, username, role, hashedPassword], function(err) {
    if (err) {
      console.error('Error creating user:', err);
      callback(err);
    } else {
      callback(null, { id: this.lastID, first_name, last_name, username, role });
    }
  });
}

function getUserById(id, callback) {
  db.get('SELECT id, first_name, last_name, username, role FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      console.error('Error fetching user by ID:', err);
      callback(err);
    } else {
      callback(null, user);
    }
  });
}

function getAllUsers(callback) {
  db.all('SELECT id, first_name, last_name, username, role FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

function deleteUser(id, callback) {
  // Verificar si el usuario a eliminar es el administrador por defecto
  db.get('SELECT username FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      console.error('Error fetching user by ID:', err);
      callback(err);
    } else if (user && user.username === 'admin') {
      callback(new Error('No se puede eliminar el administrador por defecto'));
    } else {
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting user:', err);
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
}

function updateUser(id, updateData, callback) {
  const { first_name, last_name, username, role, password } = updateData;

  db.get('SELECT username FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      console.error('Error fetching user by ID:', err);
      callback(err);
    } else if (user && user.username === 'admin') {
      callback(new Error('No se puede editar el administrador por defecto'));
    } else {
      let query, params;

      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        query = 'UPDATE users SET first_name = ?, last_name = ?, username = ?, role = ?, password = ? WHERE id = ?';
        params = [first_name, last_name, username, role, hashedPassword, id];
      } else {
        query = 'UPDATE users SET first_name = ?, last_name = ?, username = ?, role = ? WHERE id = ?';
        params = [first_name, last_name, username, role, id];
      }

      db.run(query, params, function(err) {
        if (err) {
          console.error('Error updating user:', err);
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
}

function login(username, password, callback) {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      console.error('Authentication failed:', err);
      callback(new Error('Autenticación fallida'));
    } else {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '1d' });
      callback(null, token);
    }
  });
}

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  const tokenParts = token.split(' ');
  if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
    return res.status(400).json({ message: 'Invalid token format' });
  }
  jwt.verify(tokenParts[1], secretKey, (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err);
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  login,
  verifyToken
};