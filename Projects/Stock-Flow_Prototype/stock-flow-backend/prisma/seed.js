require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Estudo123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@stockflow.local' },
    update: {},
    create: {
      name: 'Conta de demonstração',
      email: 'demo@stockflow.local',
      passwordHash
    }
  });

  await prisma.product.createMany({
    data: [
      { name: 'Teclado compacto', sku: 'TEC-001', category: 'Periféricos', price: 12500, quantity: 18, minQuantity: 5, ownerId: user.id },
      { name: 'Rato sem fios', sku: 'RAT-002', category: 'Periféricos', price: 7800, quantity: 4, minQuantity: 6, ownerId: user.id },
      { name: 'Suporte para portátil', sku: 'SUP-003', category: 'Acessórios', price: 9900, quantity: 12, minQuantity: 3, ownerId: user.id }
    ],
    skipDuplicates: true
  });

  console.log('Dados de demonstração criados.');
  console.log('Login: demo@stockflow.local | Palavra-passe: Estudo123!');
}

main()
  .catch(error => { console.error(error); process.exit(1); })
  .finally(() => prisma.$disconnect());
