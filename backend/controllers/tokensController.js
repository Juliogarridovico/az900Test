const db = require('../db/db');



exports.deleteToken = async (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM tokens WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Token no encontrado" });
    }
    return res.status(200).json({ message: "Token borrado exitosamente" });
  });
};

exports.getTokens = async (req, res) => {
    
    db.all("SELECT * FROM tokens", [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ error: "No se encontraron tokens" });
      }
      
      return res.status(200).json(rows);
    });
  };
  
