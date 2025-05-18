import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// ===== SIGNUP CONTROLLER =====
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log('Signup Request Body:', req.body);

  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, 'Email already registered'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
    });
  } catch (error) {
    next(error);
  }
};

// ===== SIGNIN CONTROLLER =====
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET || 'mysecret'
    );

    const { password: pass, ...userData } = validUser._doc;

    return res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'Signin successful',
        user: userData,
      });
  } catch (error) {
    next(error);
  }
};

// ===== GOOGLE SIGNIN CONTROLLER =====
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  if (!email || !name || !googlePhotoUrl) {
    return next(errorHandler(400, 'Missing google account info'));
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username:
          name.toLowerCase().replace(/\s+/g, '') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'mysecret'
    );

    const { password, ...userData } = user._doc;

    return res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'Google Signin successful',
        user: userData,
      });
  } catch (error) {
    next(error);
  }
};
