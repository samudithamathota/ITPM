const express = require("express");
const { updateRow } = require("../routes/updateRow");
const router = express.Router();
router.put("/update", updateRow);
module.exports = router;
