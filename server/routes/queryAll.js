const express = require("express");
const { queryAll } = require("../routes/queryAll");
const router = express.Router();
router.get("/get", queryAll);
module.exports = router;
