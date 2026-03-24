import express from 'express';
import passport from '../utils/passportConfig.js';
import { register, getAllUsers, getUserById, deleteUser } from '../controllers/UserController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ 
        message: 'Logged in successfully', 
        user: { name: user.name, email: user.email, role: user.role, id: user._id } 
      });
    });
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/', isAuthenticated, isAdmin, getAllUsers);          
router.get('/:id', isAuthenticated, isAdmin, getUserById);       
router.delete('/:id', isAuthenticated, isAdmin, deleteUser); 

export default router;