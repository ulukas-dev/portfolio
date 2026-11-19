const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(80),
  email: z.string().trim().email('Indica um e-mail válido.').transform(value => value.toLowerCase()),
  password: z.string().min(8, 'A palavra-passe deve ter pelo menos 8 caracteres.').max(100)
});

const loginSchema = z.object({
  email: z.string().trim().email().transform(value => value.toLowerCase()),
  password: z.string().min(1, 'Indica a palavra-passe.')
});

module.exports = { registerSchema, loginSchema };
