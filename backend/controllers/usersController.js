const db = require("../db/db");
const utilsController = require("../controllers/utilsController");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (utilsController.validateEmail(email)) {
    db.get(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (row) {
          return res
            .status(400)
            .json({ error: "El correo electrónico ya está en uso" });
        }

        // Si el email no existe, procedemos con la inserción
        try {
          const hashedPassword = await utilsController.encryptString(password);
          db.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              // Generamos un token y lo guardamos en la base de datos
              const userId = this.lastID;
              const { token, expires_at } =
                utilsController.generateAuthToken(userId);

              db.run(
                "INSERT INTO tokens (user_id, access_token, expires_at) VALUES (?, ?, ?)",
                [userId, token, expires_at],
                function (err) {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }
                  return res.status(201).json({ id: userId, token }); // Retorna el id del usuario y el token
                }
              );
            }
          );
        } catch {
          res.status(500).send();
        }
      }
    );
  } else {
    return res
      .status(400)
      .json({ error: "El correo electrónico no es valido" });
  }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  
    db.run("DELETE FROM tokens WHERE user_id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
        return res.status(200).json({ message: "Usuario borrado exitosamente" });
      });
    });
  };
  

exports.updatePassword = async (req, res) => {
  const { id, password } = req.body;

  try {
    const hashedPassword = await utilsController.encryptString(password);
    db.run(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }
        return res.status(200).send(); // OK
      }
    );
  } catch {
    res.status(500).send();
  }
};

exports.mostrarRegistros = async (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(rows);
  });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
   
    if (utilsController.validateEmail(email)) {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (!user) {
            return res
              .status(400)
              .json({ error: "Correo electrónico o Contraseña incorrecta" });
          }
  
          const isPasswordValid = await utilsController.compareString(
            password,
            user.password
          );
          if (!isPasswordValid) {
            return res.status(400).json({ error: "Correo electrónico o Contraseña incorrecta" });
          }
  
          db.get(
            "SELECT access_token FROM tokens WHERE user_id = ?",
            [user.id],
            (err, tokenRow) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              return res.status(200).json({ token: tokenRow.access_token });
            }
          );
        }
      );
    } else {
      return res.status(400).json({ error: "El correo electrónico no es válido" });
    }
  };
  
