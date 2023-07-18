const db = require('../db/db');

exports.createQuestion = async (req, res) => {
  try {
    const { pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, explicacion } = req.body;
    
    await db.run(
      `INSERT INTO quizzesTable (pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, explicacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, explicacion]
    );

    const lastInsertedId = db.lastID;
      console.log(pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, explicacion)
    res.status(201).json({ message: 'Pregunta creada exitosamente:', lastInsertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocurrió un error al crear la pregunta' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id, pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, explicacion } = req.body;

    await db.run(
      `UPDATE quizzesTable 
       SET pregunta = ?, opcionA = ?, opcionB = ?, opcionC = ?, opcionD = ?, respuestaCorrecta = ?, explicacion = ?
       WHERE id = ?`,
      [pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, explicacion, id]
    );

    res.status(200).json({ message: 'Pregunta actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocurrió un error al actualizar la pregunta' });
  }
};

exports.getQuestions = async (req, res) => {
  
  db.all("SELECT * FROM quizzesTable", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(rows);
  });
};
