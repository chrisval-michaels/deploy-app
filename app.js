import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import albumRoutes from './routes/albums.js';
import userRoutes from './routes/UserRoute.js'; 
import { requestLogger } from './middleware/requestLogger.js';
import passport from './utils/passportConfig.js'; 
import { connectDB } from './db.js';

const app = express();
const PORT = 3000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(requestLogger);
app.use(express.static('public'));

// Sessions
app.use(session({
  secret: 'yourSecretKey123',           // Change to a strong secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://backend-user:backend4040@backend.9pm5ex2.mongodb.net/backend-data?appName=Backend' }),
  cookie: { maxAge: 1000 * 60 * 60 }   // 1 hour session
}));

app.use(passport.initialize());
app.use(passport.session()); 

// Routes
app.use('/albums', albumRoutes);
app.use('/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});