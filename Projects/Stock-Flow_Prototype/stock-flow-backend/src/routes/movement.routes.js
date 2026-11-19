const router = require('express').Router();
const controller = require('../controllers/movement.controller');
const requireAuth = require('../middlewares/auth.middleware');

router.use(requireAuth);
router.get('/', controller.list);
router.post('/', controller.create);

module.exports = router;
