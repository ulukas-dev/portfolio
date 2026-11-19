const router = require('express').Router();
const controller = require('../controllers/product.controller');
const requireAuth = require('../middlewares/auth.middleware');

router.use(requireAuth);
router.get('/summary', controller.summary);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
