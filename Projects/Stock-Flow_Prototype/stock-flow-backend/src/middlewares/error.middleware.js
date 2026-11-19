function notFound(req, res, next) {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === 'ZodError') {
    return res.status(400).json({
      message: 'Os dados enviados não são válidos.',
      errors: error.errors.map(item => ({
        field: item.path.join('.'),
        message: item.message
      }))
    });
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ message: 'Já existe um registo com esse identificador.' });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ message: 'Registo não encontrado.' });
  }

  const status = error.statusCode || 500;
  const message = status === 500 ? 'Ocorreu um erro interno.' : error.message;

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
