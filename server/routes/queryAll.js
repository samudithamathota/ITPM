const express = require("express");
const { queryAll } = require("../controllers/queryAll");
const router = express.Router();
router.get("/get", queryAll);
module.exports = router;
