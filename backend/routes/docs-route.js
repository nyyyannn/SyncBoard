const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const createDocSchema = require("../validators/document-validator");
const { createDoc, getDocById } = require("../controllers/docs-controller");
const validate = require("../middlewares/validate-middleware");

router.post("/", authMiddleware, validate(createDocSchema), createDoc);
router.get("/:id", authMiddleware, getDocById);

module.exports = router;
