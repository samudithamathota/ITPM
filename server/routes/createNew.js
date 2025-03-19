const express = require("express");
const { createNew } = require("../controllers/createNew");
const router = express.Router();
router.post("/add", createNew);
module.exports = router;
