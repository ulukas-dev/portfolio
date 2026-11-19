const { z } = require('zod');

const movementSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(['IN', 'OUT']),
  quantity: z.coerce.number().int().positive('A quantidade deve ser maior que zero.'),
  note: z.string().trim().max(250).optional()
});

module.exports = { movementSchema };
