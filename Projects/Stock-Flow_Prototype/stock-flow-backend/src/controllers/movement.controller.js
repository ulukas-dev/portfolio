const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/async-handler');
const { movementSchema } = require('../validators/movement.validator');

const list = asyncHandler(async (req, res) => {
  const movements = await prisma.stockMovement.findMany({
    where: { userId: req.user.id },
    include: { product: { select: { id: true, name: true, sku: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  res.json({ data: movements });
});

const create = asyncHandler(async (req, res) => {
  const data = movementSchema.parse(req.body);

  const result = await prisma.$transaction(async tx => {
    const product = await tx.product.findFirst({
      where: { id: data.productId, ownerId: req.user.id }
    });

    if (!product) {
      const error = new Error('Produto não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const newQuantity = data.type === 'IN'
      ? product.quantity + data.quantity
      : product.quantity - data.quantity;

    if (newQuantity < 0) {
      const error = new Error('Stock insuficiente para esta saída.');
      error.statusCode = 409;
      throw error;
    }

    const updatedProduct = await tx.product.update({
      where: { id: product.id },
      data: { quantity: newQuantity }
    });

    const movement = await tx.stockMovement.create({
      data: {
        type: data.type,
        quantity: data.quantity,
        note: data.note,
        productId: product.id,
        userId: req.user.id
      }
    });

    return { product: updatedProduct, movement };
  });

  res.status(201).json({
    message: data.type === 'IN' ? 'Entrada de stock registada.' : 'Saída de stock registada.',
    data: result
  });
});

module.exports = { list, create };
