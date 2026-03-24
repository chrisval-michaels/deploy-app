import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import albumRoutes from './routes/albums.js';
import userRoutes from './routes/UserRoute.js';
import { requestLogger } from './middleware/requestLogger.js';
import passport from './utils/passportConfig.js';
import { connectDB } from './db.js';

const app = express();

// Connect to Database only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(express.json());
app.use(requestLogger);
app.use(express.static('public'));

// Sessions – use environment variables for secret and database URI
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey123', // fallback for dev
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // read from env
  cookie: { maxAge: 1000 * 60 * 60 }   // 1 hour session
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/albums', albumRoutes);
app.use('/users', userRoutes);

export default app; // <-- important: export app for testing and server.js