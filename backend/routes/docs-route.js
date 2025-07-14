const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const createDocSchema = require("../validators/document-validator");
const { createDoc, getDocById, getAllDocs, inviteCollaborator, deleteDocById } = require("../controllers/docs-controller");
const validate = require("../middlewares/validate-middleware");

router.get("/", authMiddleware, getAllDocs);
router.post("/create", authMiddleware, validate(createDocSchema), createDoc);
router.get("/:id", authMiddleware, getDocById);
router.post("/:id/invite", authMiddleware, inviteCollaborator);
router.delete("/:id",authMiddleware, deleteDocById);

module.exports = router;
