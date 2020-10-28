const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

// api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов') // валидация,проверка введенных данных
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const erros = validationResult(req);

      if (!erros.isEmpty()) {
        return res.status(400).json({
          erros: erros.array(),
          message: 'Неккоректные данный при регистрации',
        });
      }

      const { email, password, name } = req.body; //получение  данных с фронта

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Такой пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword, name });

      await user.save();

      res.status(201).json({ message: 'Пользователь создан' });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так,попробуйте снова...' });
    }
  }
);

// api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req, res) => {
    try {
      const erros = validationResult(req);

      if (!erros.isEmpty()) {
        return res.status(400).json({
          erros: erros.array(),
          message: 'Неккоректные данные при входе в систему',
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }); //поиск пользователя

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Неверный пароль,попробуйте снова' });
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      });

      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так,попробуйте снова...' });
    }
  }

  // api/auth/login
);

module.exports = router;
