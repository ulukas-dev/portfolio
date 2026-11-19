const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/async-handler');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true }
  });

  res.status(201).json({
    message: 'Conta criada com sucesso.',
    user,
    token: createToken(user.id)
  });
});

const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return res.status(401).json({ message: 'E-mail ou palavra-passe incorretos.' });
  }

  res.json({
    message: 'Sessão iniciada.',
    user: { id: user.id, name: user.name, email: user.email },
    token: createToken(user.id)
  });
});

module.exports = { register, login };
