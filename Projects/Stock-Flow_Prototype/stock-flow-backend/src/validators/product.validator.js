const { z } = require('zod');

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sku: z.string().trim().min(2).max(40).transform(value => value.toUpperCase()),
  description: z.string().trim().max(500).optional().nullable(),
  category: z.string().trim().min(2).max(60),
  price: z.coerce.number().positive('O preço deve ser maior que zero.'),
  quantity: z.coerce.number().int().min(0).default(0),
  minQuantity: z.coerce.number().int().min(0).default(5)
});

const updateProductSchema = productSchema.partial();

module.exports = { productSchema, updateProductSchema };
