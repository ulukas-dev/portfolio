const prisma = require('../lib/prisma');
const asyncHandler = require('../utils/async-handler');
const { productSchema, updateProductSchema } = require('../validators/product.validator');

const list = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 50);
  const search = String(req.query.search || '').trim();
  const category = String(req.query.category || '').trim();

  const where = {
    ownerId: req.user.id,
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    ...(category ? { category: { equals: category, mode: 'insensitive' } } : {})
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.product.count({ where })
  ]);

  res.json({
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

const getById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    include: { movements: { orderBy: { createdAt: 'desc' }, take: 10 } }
  });

  if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
  res.json({ data: product });
});

const create = asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body);
  const product = await prisma.product.create({
    data: { ...data, ownerId: req.user.id }
  });
  res.status(201).json({ message: 'Produto criado.', data: product });
});

const update = asyncHandler(async (req, res) => {
  const data = updateProductSchema.parse(req.body);
  const existing = await prisma.product.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    select: { id: true }
  });

  if (!existing) return res.status(404).json({ message: 'Produto não encontrado.' });

  const product = await prisma.product.update({
    where: { id: existing.id },
    data
  });
  res.json({ message: 'Produto actualizado.', data: product });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await prisma.product.findFirst({
    where: { id: req.params.id, ownerId: req.user.id },
    select: { id: true }
  });

  if (!existing) return res.status(404).json({ message: 'Produto não encontrado.' });

  await prisma.product.delete({ where: { id: existing.id } });
  res.status(204).send();
});

const summary = asyncHandler(async (req, res) => {
  const [totalProducts, products] = await Promise.all([
    prisma.product.count({ where: { ownerId: req.user.id } }),
    prisma.product.findMany({
      where: { ownerId: req.user.id },
      select: { quantity: true, minQuantity: true }
    })
  ]);

  const lowStock = products.filter(product =>
    product.quantity <= product.minQuantity
  ).length;

  const unitsInStock = products.reduce((total, product) =>
    total + product.quantity, 0
  );

  res.json({
    data: {
      totalProducts,
      lowStock,
      unitsInStock
    }
  });
});

module.exports = { list, getById, create, update, remove, summary };
