const express = require("express");
const { destroy } = require("../controllers/destroy");
const router = express.Router();
router.delete("/delete", destroy);
module.exports = router;
