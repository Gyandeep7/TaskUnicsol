import express from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import bcrypt from 'bcrypt'

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const userRepository = getRepository(User);
    
        const { username, password } = req.body;
    
        const existingUser = await userRepository.findOne({ where: { username } });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already taken' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = userRepository.create({
          username,
          password: hashedPassword,
        });
    
        await userRepository.save(newUser);
    
        return res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
});

router.post('/login', async (req, res) => {
    try {
        const userRepository = getRepository(User);
    
        const { username, password } = req.body;
    
        const user = await userRepository.findOne({ where: { username } });
    
        if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
    
        return res.status(200).json({ message: 'Login successful' });
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
});

router.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ message: 'Internal server error' });
          }

          res.clearCookie('your_cookie_name');
    
          return res.status(200).json({ message: 'Logout successful' });
        });
      } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
});

export { router as UserController };
