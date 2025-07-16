const Express = require('express');
const router = Express.Router();
const { register } = require('../controllers/auth-controller');
const { login,user } = require('../controllers/auth-controller');
const signupSchema = require('../validators/auth-validator');
const loginSchema = require('../validators/login-validator');
const validate = require('../middlewares/validate-middleware');
const authMiddleware = require("../middlewares/auth-middleware");

router.
route("/register").
post(
  validate(signupSchema), // Validate request body against the schema
  register // Call the register controller function
);

router.
route("/login").
post(
  validate(loginSchema),
  login
);

router
.route("/user")
.get(authMiddleware,user);

module.exports = router;