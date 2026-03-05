const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow common local frontend origins (3000/3001/5173) plus explicitly configured origin.
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.add(process.env.CLIENT_ORIGIN);
}

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools and same-machine development origins
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'login-api',
    time: new Date().toISOString(),
  });
});

function handleLogin(req, res) {
  const { username, password } = req.body || {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      message: 'Username and password are required.',
      code: 'VALIDATION_ERROR',
    });
  }

  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    return res.status(400).json({
      message: 'Username and password cannot be empty.',
      code: 'VALIDATION_ERROR',
    });
  }

  if (cleanUsername === 'admin' && cleanPassword === 'admin') {
    return res.status(200).json({
      message: 'Login successful.',
      username: cleanUsername,
      loginAt: new Date().toISOString(),
    });
  }

  return res.status(401).json({
    message: 'Invalid username or password.',
    code: 'INVALID_CREDENTIALS',
  });
}

// Support both required assignment path and API-prefixed path.
app.post('/login', handleLogin);
app.post('/api/login', handleLogin);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Login API running on http://localhost:${PORT}`);
});
