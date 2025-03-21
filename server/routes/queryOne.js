const express = require("express");
const { queryOne } = require("../controllers/queryOne");
const router = express.Router();
router.get("/getOne", queryOne);
module.exports = router;
