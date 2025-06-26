const Express = require('express');
const router = Express.Router();
const { register } = require('../controllers/auth-controller');
const signupSchema = require('../validators/auth-validator');
const validate = require('../middlewares/validate-middleware');

router.
route("/register").
post(
  validate(signupSchema), // Validate request body against the schema
  register // Call the register controller function
);

module.exports = router;