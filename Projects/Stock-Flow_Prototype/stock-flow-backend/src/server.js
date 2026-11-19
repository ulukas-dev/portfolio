require('dotenv').config();

const app = require('./app');
const prisma = require('./lib/prisma');

const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, () => {
  console.log(`Stock Flow API disponível em http://localhost:${PORT}`);
});

async function shutdown() {
  console.log('\nA encerrar a API...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
