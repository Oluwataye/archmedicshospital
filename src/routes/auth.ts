import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import db from '../config/database';
import { logger } from '../utils/logger';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['admin', 'doctor', 'nurse', 'pharmacist', 'labtech', 'cashier', 'ehr']),
  department: z.string().optional(),
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  phone: z.string().optional(),
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await db('users')
      .where({ email, is_active: true })
      .first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ last_login: new Date() });

    // Generate JWT token
    const tokenOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      tokenOptions
    );

    // Generate refresh token
    const refreshTokenOptions = { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as any;
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      refreshTokenOptions
    );

    logger.info(`User logged in: ${user.email}`);

    return res.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        specialty: user.specialty,
        licenseNumber: user.license_number,
        phone: user.phone,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    logger.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Register endpoint (admin only)
router.post('/register', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Only admins can register new users
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can register new users' });
    }

    const userData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db('users')
      .where('email', userData.email)
      .orWhere('username', userData.username)
      .first();

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Create user
    const [newUser] = await db('users')
      .insert({
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        department: userData.department,
        specialty: userData.specialty,
        license_number: userData.licenseNumber,
        phone: userData.phone,
      })
      .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'license_number', 'phone', 'created_at']);

    logger.info(`New user registered: ${newUser.email} by ${req.user?.email}`);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        department: newUser.department,
        specialty: newUser.specialty,
        licenseNumber: newUser.license_number,
        phone: newUser.phone,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    logger.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string };

    // Find user
    const user = await db('users')
      .where({ id: decoded.id, is_active: true })
      .first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const tokenOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      tokenOptions
    );

    return res.json({ token });
  } catch (error) {
    logger.error('Token refresh error:', error);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await db('users')
      .where({ id: req.user?.id })
      .select(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'license_number', 'phone', 'last_login', 'created_at'])
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department,
      specialty: user.specialty,
      licenseNumber: user.license_number,
      phone: user.phone,
      lastLogin: user.last_login,
      createdAt: user.created_at,
    });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // In a more sophisticated implementation, you might want to blacklist the token
    logger.info(`User logged out: ${req.user?.email}`);
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
