var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login',userController.login);
router.post('/register',userController.register);
module.exports = router;
