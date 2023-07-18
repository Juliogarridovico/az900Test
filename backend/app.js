const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const usersRouter = require('./routes/users');
const quizzesRouter = require('./routes/quizzes');
const tokensRouter = require('./routes/tokens.js');

app.use(express.json());

// Configuración del límite de llamadas por minuto (10 llamadas por minuto)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 66, // máximo 10 solicitudes por minuto
});

app.use(limiter);

app.use('/users', usersRouter);
app.use('/quizzes', quizzesRouter);
app.use('/tokens', tokensRouter);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
